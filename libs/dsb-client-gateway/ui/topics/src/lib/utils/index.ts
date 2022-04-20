import { keyBy } from 'lodash';
import { schemaTypeOptions } from '../models';

export const schemaTypeOptionsByValue = keyBy(schemaTypeOptions, 'value');
export const schemaTypeOptionsByLabel = keyBy(schemaTypeOptions, 'label');
