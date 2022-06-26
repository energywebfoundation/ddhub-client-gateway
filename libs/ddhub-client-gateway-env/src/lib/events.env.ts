import * as Joi from 'joi';

export const EVENTS_ENV = Joi.object({
  INTERNAL_EVENTS_TIMEOUT: Joi.number()
    .default(5)
    .description('How often internal events interval should execute (seconds)'),
});
