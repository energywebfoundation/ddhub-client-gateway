import { Injectable, Logger } from '@nestjs/common';
import {
  CacheClient,
  Claim,
  ClaimsService,
  DIDAttribute,
  DidRegistry,
  RegistrationTypes,
  SignerService,
  IApp
} from 'iam-client-lib';
import { IamFactoryService } from './iam-factory.service';
import { ConfigService } from '@nestjs/config';
import { Encoding } from '@ew-did-registry/did-resolver-interface';
import { KeyType } from '@ew-did-registry/keys';

@Injectable()
export class IamService {
  private cacheClient: CacheClient;
  private claimsService: ClaimsService;
  private didRegistry: DidRegistry;
  private signerService: SignerService;

  private readonly logger = new Logger(IamService.name);

  constructor(
    protected readonly iamFactoryService: IamFactoryService,
    protected readonly configService: ConfigService
  ) { }

  public async setVerificationMethod(
    publicKey: string,
    tag = 'dsb'
  ): Promise<void> {
    await this.didRegistry.updateDocument({
      did: this.getDIDAddress(),
      didAttribute: DIDAttribute.PublicKey,
      data: {
        type: DIDAttribute.PublicKey,
        encoding: Encoding.HEX,
        algo: KeyType.Secp256k1,
        value: {
          type: KeyType.Secp256k1,
          tag,
          publicKey,
        },
      },
    });
  }

  public async setup(privateKey: string) {
    this.logger.log('Initializing IAM connection');

    const { cacheClient, didRegistry, signerService, claimsService } =
      await this.iamFactoryService.initialize(privateKey, this.configService);

    this.cacheClient = cacheClient;
    this.didRegistry = didRegistry;
    this.signerService = signerService;
    this.claimsService = claimsService;
  }

  public getClaimById(id: string): Promise<Claim> {
    return this.claimsService.getClaimById(id);
  }

  public getApplicationsByOwner(ownerDid: string): Promise<IApp[]> {
    return this.cacheClient.getApplicationsByOwner(ownerDid);
  }

  public getClaimsByRequester(
    did: string,
    namespace: string
  ): Promise<Claim[]> {
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

  public async publishPublicClaim(token: string): Promise<void> {
    await this.claimsService.publishPublicClaim({
      token,
    });
  }

  public async requestClaim(claim: string): Promise<void> {
    await this.claimsService.createClaimRequest({
      claim: {
        claimType: claim,
        claimTypeVersion: 1,
        fields: [],
      },
      registrationTypes: [
        RegistrationTypes.OnChain,
        RegistrationTypes.OffChain,
      ],
    });
  }

  public getDid(did?: string, includeClaims = false) {
    return this.didRegistry.getDidDocument({
      did,
      includeClaims,
    });
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
