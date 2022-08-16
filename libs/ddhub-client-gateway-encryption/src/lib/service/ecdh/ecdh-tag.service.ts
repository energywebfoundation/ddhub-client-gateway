import { Injectable } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

export interface Tag {
  full: string;
  dailyIteration: number;
  iteration: string;
}

@Injectable()
export class EcdhTagService {
  protected readonly prefix = 'ddhub-ecdh';

  constructor(protected readonly iamService: IamService) {}

  public getKeysWithMatchingIteration(didDocument, iteration: string): any[] {
    return didDocument.publicKey.filter((publicKey) => {
      const splitted = publicKey.id.split('#')[1];

      return !!(splitted.includes(iteration) && splitted.includes(this.prefix));
    }, []);
  }

  public computeTag(iteration: string | number, utcDate: string): string {
    return `${this.prefix}-${iteration}-${utcDate}`;
  }

  public async createTag(iteration: string): Promise<Tag> {
    const didDocument = await this.iamService.getDid(
      this.iamService.getDIDAddress()
    );

    const existingKeys = this.getKeysWithMatchingIteration(
      didDocument,
      iteration
    );

    return {
      full: `${this.prefix}-${existingKeys.length}-${iteration}`,
      dailyIteration: existingKeys.length,
      iteration,
    };
  }
}
