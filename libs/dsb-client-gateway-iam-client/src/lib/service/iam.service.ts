import { Injectable, Logger } from '@nestjs/common';
import {
  CacheClient,
  Claim as DIDClaim,
  ClaimsService,
  DIDAttribute,
  DidRegistry,
  PubKeyType,
  RegistrationTypes,
  SignerService,
} from 'iam-client-lib';
import { IAppDefinition } from '@energyweb/credential-governance';
import { IamFactoryService } from './iam-factory.service';
import { ConfigService } from '@nestjs/config';
import { ApplicationDTO, Claim } from '../iam.interface';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import { Span } from 'nestjs-otel';
import promiseRetry from 'promise-retry';
import { Encoding } from '@ew-did-registry/did-resolver-interface';
import { KeyType } from '@ew-did-registry/keys';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Injectable()
export class IamService {
  private cacheClient: CacheClient;
  private claimsService: ClaimsService;
  private didRegistry: DidRegistry;
  private signerService: SignerService;
  private initialized = false;

  private readonly logger = new Logger(IamService.name);

  constructor(
    protected readonly iamFactoryService: IamFactoryService,
    protected readonly configService: ConfigService,
    protected readonly retryConfigService: RetryConfigService
  ) {}

  @Span('iam_getClaimsWithStatus')
  public async getClaimsWithStatus(): Promise<Claim[]> {
    const claims: DIDClaim[] = await this.getClaims();
    const synchronizedToDIDClaims = await this.getUserClaimsFromDID();

    const getClaimStatus = (claim: DIDClaim): RoleStatus => {
      if (claim.isAccepted) {
        return RoleStatus.APPROVED;
      }

      if (claim.isRejected) {
        return RoleStatus.REJECTED;
      }

      if (!claim.isAccepted && !claim.isRejected) {
        return RoleStatus.AWAITING_APPROVAL;
      }

      return RoleStatus.NOT_ENROLLED;
    };

    return claims.map((claim) => {
      return {
        namespace: claim.claimType,
        status: getClaimStatus(claim),
        syncedToDidDoc:
          synchronizedToDIDClaims.filter(
            (synchronizedClaim) =>
              synchronizedClaim.claimType === claim.claimType
          ).length > 0,
      };
    });
  }

  public getDidRegistry(): DidRegistry | undefined {
    return this.didRegistry;
  }

  @Span('iam_getClaims')
  public async getClaims(): Promise<DIDClaim[]> {
    return this.cacheClient.getClaimsBySubject(this.getDIDAddress());
  }

  @Span('iam_getUserClaimsFromDID')
  public async getUserClaimsFromDID() {
    return this.claimsService.getUserClaims({
      did: this.getDIDAddress(),
    });
  }

  @Span('iam_setVerificationMethod')
  public async setVerificationMethod(
    publicKey: string,
    tag = 'dsb',
    type: PubKeyType = PubKeyType.VerificationKey2018,
    algo: KeyType = KeyType.RSA,
    encoding: Encoding = Encoding.HEX
  ): Promise<void> {
    await promiseRetry(
      async (retryFn, attempt) => {
        this.logger.log(
          `attempting to update ${tag} in DID document of ${this.getDIDAddress()}, attempt number ${attempt}`
        );

        await this.didRegistry
          .updateDocument({
            did: this.getDIDAddress(),
            didAttribute: DIDAttribute.PublicKey,
            data: {
              type,
              encoding,
              algo,
              value: {
                type: algo,
                tag,
                publicKey,
              },
            },
          })
          .catch((e) => {
            this.logger.error(
              `failed during updating verification method ${this.getDIDAddress()}`,
              e
            );

            return retryFn(e);
          });
      },
      {
        ...this.retryConfigService.config,
      }
    );
  }

  public async getEnrolledDids(roleName: string): Promise<string[]> {
    return this.cacheClient.getDIDsForRole(roleName);
  }

  @Span('iam_setup')
  public async setup(privateKey: string) {
    this.logger.log('Initializing IAM connection');

    const { cacheClient, didRegistry, signerService, claimsService } =
      await this.iamFactoryService.initialize(privateKey, this.configService);

    this.cacheClient = cacheClient;
    this.didRegistry = didRegistry;
    this.signerService = signerService;
    this.claimsService = claimsService;

    this.initialized = true;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  @Span('iam_getClaimById')
  public getClaimById(id: string): Promise<DIDClaim> {
    return this.claimsService.getClaimById(id);
  }

  @Span('iam_getApplicationsByOwnerAndRole')
  public async getApplicationsByOwnerAndRole(
    roleName: string,
    ownerDid: string
  ): Promise<ApplicationDTO[]> {
    this.logger.debug('start: ApplicationsByOwnerAndRole');

    const didClaims = await this.cacheClient
      .getClaimsByRequester(ownerDid, {
        isAccepted: true,
      })
      .catch((e) => {
        this.logger.log('fetching claims by requester failed', e);

        throw e;
      });

    const namespaceList = [];
    const applications: IAppDefinition[] = [];

    this.logger.debug('did claims fetched');

    didClaims.forEach((didClaim) => {
      if (
        didClaim.claimType.startsWith(`${roleName}.`) &&
        didClaim.namespace !== this.configService.get('DID_CLAIM_NAMESPACE')
      ) {
        namespaceList.push(didClaim.namespace);
      }
    });

    this.logger.debug(
      `did claims with ${this.configService.get('DID_CLAIM_NAMESPACE')} removed`
    );

    this.logger.debug(`start: fetching application for all did claims.`);

    await Promise.all(
      namespaceList.map(async (namespace: string) => {
        const application = (await this.cacheClient
          .getAppDefinition(namespace)
          .catch((e) => {
            this.logger.error(
              'getting app definition for ' + namespace + ' failed'
            );
            this.logger.error(e);

            throw e;
          })) as ApplicationDTO;
        application.namespace = namespace;
        applications.push(application);
      })
    );

    this.logger.debug(`end: fetching application for all did claims.`);

    const uniqueApplications = [...new Set(applications)];

    this.logger.debug('end: ApplicationsByOwnerAndRole');

    return uniqueApplications;
  }

  public getClaimsByRequester(
    did: string,
    namespace: string
  ): Promise<Claim[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.cacheClient.getClaimsByRequester(did, {
      namespace,
    });
  }

  public async decodeJWTToken(
    token: string
  ): Promise<{ [key: string]: Claim }> {
    return (await this.didRegistry.decodeJWTToken({
      token,
    })) as Promise<{ [key: string]: Claim }>;
  }

  @Span('iam_publishPublicClaim')
  public async publishPublicClaim(token: string): Promise<void> {
    await this.claimsService.publishPublicClaim({
      claim: { token },
    });
  }

  @Span('iam_requestClaim')
  public async requestClaim(claim: string): Promise<void> {
    const claimObject = {
      claim: {
        claimType: claim,
        claimTypeVersion: 1,
        fields: [],
      },
      registrationTypes: [
        RegistrationTypes.OnChain,
        RegistrationTypes.OffChain,
      ],
    };

    this.logger.log('Requesting claim', claimObject);

    await this.claimsService.createClaimRequest(claimObject);
  }

  @Span('iam_getDid')
  public async getDid(did?: string, includeClaims = false) {
    return promiseRetry(
      async (retryFn, attempt) => {
        this.logger.log(`attempting to receive DID ${did}, attempt ${attempt}`);

        return this.didRegistry
          .getDidDocument({
            did: this.getDIDAddress(),
            includeClaims,
          })
          .catch((e) => {
            this.logger.error(`Failed fetching did ${did}`, e);

            return retryFn(e);
          });
      },
      {
        ...this.retryConfigService.config,
      }
    );
  }

  public getDIDAddress(): string | null {
    if (!this.signerService) {
      return null;
    }

    return this.signerService.did;
  }
}

/**
 *
 * can you get list of DIDs based on role/roles - ask Jakub
 */
