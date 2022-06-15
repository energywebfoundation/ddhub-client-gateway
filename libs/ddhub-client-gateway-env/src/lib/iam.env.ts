import * as Joi from 'joi';

export const IAM_ENVS = Joi.object({
  RPC_URL: Joi.string()
    .uri()
    .default('https://volta-rpc.energyweb.org/')
    .description('EWF RPC URL'),
  PARENT_NAMESPACE: Joi.string()
    .default('dsb.apps.energyweb.iam.ewc')
    .description('Parent namespace for IAM lookup'),
  EVENT_SERVER_URL: Joi.string()
    .uri()
    .default('identityevents-dev.energyweb.org')
    .description('NATS URL for listening for DID roles updates'),
  NATS_ENV_NAME: Joi.string().default('ewf-dev'),
  CHAIN_ID: Joi.number().positive().default(73799).description('Chain ID'),
  CACHE_SERVER_URL: Joi.string()
    .uri()
    .default('https://identitycache-dev.energyweb.org/v1')
    .description('SSI HUB url'),
  CLAIM_MANAGER_ADDRESS: Joi.string()
    .default('CLAIM_MANAGER_ADDRESS')
    .description('Overrides default IAM Client Lib claim manager address'),
  CHAIN_NAME: Joi.string().default('VOLTA').description('Chain name'),
  ENS_URL: Joi.string()
    .uri()
    .default('https://volta-rpc-vkn5r5zx4ke71f9hcu0c.energyweb.org')
    .description('Will be deprecated - same as RPC_URL'),
});
//
// export class IamEnv {
//   @IsString()
//   RPC_URL = 'https://volta-rpc.energyweb.org/';
//
//   @IsString()
//   PARENT_NAMESPACE = 'dsb.apps.energyweb.iam.ewc';
//
//   @IsString()
//   EVENT_SERVER_URL = 'identityevents-dev.energyweb.org';
//
//   @IsString()
//   NATS_ENV_NAME = 'ewf-dev';
//
//   @IsPositive()
//   @Transform(IamEnv.transformNumber('CHAIN_ID'))
//   CHAIN_ID = 73799;
//
//   @IsString()
//   CACHE_SERVER_URL = 'https://identitycache-dev.energyweb.org/v1';
//
//   @IsString()
//   CLAIM_MANAGER_ADDRESS = '0x5339adE9332A604A1c957B9bC1C6eee0Bcf7a031';
//
//   static transformNumber(
//     paramKey: string
//   ): ({ obj }: { obj: IamEnv }) => number {
//     return ({ obj }) => {
//       return +obj[paramKey];
//     };
//   }
// }
