import {
  Injectable,
  NotImplementedException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetParameterCommand,
  ParameterType,
  PutParameterCommand,
  SSMClient,
} from '@aws-sdk/client-ssm';
import {
  CertificateDetails,
  SecretsEngineService,
} from '../secrets-engine.interface';

// @TODO - not fully implemented, needs testing
@Injectable()
export class AwsSsmService
  extends SecretsEngineService
  implements OnModuleInit
{
  protected client: SSMClient;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('AWS_SSM_PREFIX', '/dsb-gw/');
  }

  deleteAll(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async onModuleInit(): Promise<void> {
    this.client = new SSMClient({
      region: this.configService.get('AWS_REGION'),
    });
  }

  getRSAPrivateKey(): Promise<string | null> {
    throw new NotImplementedException();
  }

  setRSAPrivateKey(privateKey: string): Promise<void> {
    throw new NotImplementedException();
  }

  public async getCertificateDetails(): Promise<CertificateDetails> {
    const [privateKeyCommand, certificateCommand, caCertificateCommand] = [
      new GetParameterCommand({
        Name: `${this.prefix}/certificate/privateKey`,
        WithDecryption: true,
      }),
      new GetParameterCommand({
        Name: `${this.prefix}/certificate/certificate`,
        WithDecryption: true,
      }),
      new GetParameterCommand({
        Name: `${this.prefix}/certificate/caCertificate`,
        WithDecryption: true,
      }),
    ];

    const [privateKey, certificate, caCertificate] = await Promise.all([
      this.client.send(privateKeyCommand),
      this.client.send(certificateCommand),
      this.client.send(caCertificateCommand),
    ]);

    return {
      privateKey: privateKey.Parameter.Value,
      certificate: certificate.Parameter.Value,
      caCertificate: caCertificate.Parameter.Value,
    };
  }

  getEncryptionKeys(): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async getPrivateKey(): Promise<string> {
    const privateKeyCommand = new GetParameterCommand({
      Name: `${this.prefix}/privateKey`,
      WithDecryption: true,
    });

    const result = await this.client.send(privateKeyCommand);

    return result.Parameter.Value;
  }

  public async setCertificateDetails({
    caCertificate,
    certificate,
    privateKey,
  }: CertificateDetails): Promise<void> {
    const commands: PutParameterCommand[] = [
      new PutParameterCommand({
        Name: `${this.prefix}/certificate/privateKey`,
        Type: ParameterType.STRING,
        Value: privateKey,
      }),
      new PutParameterCommand({
        Name: `${this.prefix}/certificate/certificate`,
        Type: ParameterType.STRING,
        Value: certificate,
      }),
    ];

    if (caCertificate) {
      commands.push(
        new PutParameterCommand({
          Name: `${this.prefix}/certificate/caCertificate`,
          Type: ParameterType.STRING,
          Value: caCertificate,
        })
      );
    }

    await Promise.all(commands.map((command) => this.client.send(command)));
  }

  public async setPrivateKey(key: string): Promise<void> {
    const privateKeyCommand = new PutParameterCommand({
      Name: `${this.prefix}/privateKey`,
      Type: ParameterType.STRING,
      Value: key,
    });

    await this.client.send(privateKeyCommand);
  }

  setEncryptionKeys(privateKey: any): Promise<void> {
    return Promise.resolve(undefined);
  }
}
