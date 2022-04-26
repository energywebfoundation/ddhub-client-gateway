import { EntityName, Utils } from '@mikro-orm/core';

export * from './dsb-client-gateway-storage.module';
export * from './entity';
export * from './module';

export const getRepositoryToken = <T>(entity: EntityName<T>) =>
  `${Utils.className(entity)}Repository`;
