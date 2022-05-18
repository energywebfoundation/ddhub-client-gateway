import { ChannelConditionsDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useSummaryEffects = () => {
  const countRestrictions = (conditions: ChannelConditionsDto) => {
    return conditions.dids.length + conditions.roles.length;
  };
  return { countRestrictions };
};
