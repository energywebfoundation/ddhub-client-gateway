import { INestApplication, Type } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ModulesContainer } from '@nestjs/core';
import {
  OpenAPIObject,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  OperationObject,
  ResponsesObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  EXCLUDED_ROUTE,
  ROLES_KEY,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { ResponseErrorDto } from '../app/modules/utils/dto/response-error.dto';
import { SECURITY_API_KEY, SECURITY_BEARER } from './swagger.constants';

/**
 * Access rules are derived from the real guard and role metadata on each
 * controller method, so the documentation can never drift from what the
 * guards actually enforce:
 *
 * - `UserGuard` protects the route. With `USER_AUTH_ENABLED=false` every
 *   request is let through. With `USER_AUTH_ENABLED=true` the caller needs a
 *   valid Bearer access token or `x-api-key`. Accounts with the `admin` or
 *   `superadmin` role pass every `UserGuard` route; accounts with the
 *   `messaging` role only pass routes whose `@Roles(...)` list includes
 *   `messaging` (API keys without a role count as `messaging`). Any
 *   other role value is denied.
 * - `MtlsGuard` makes sure the gateway's mTLS client certificate towards the
 *   DDHub Message Broker is configured, configuring it on the fly if needed.
 * - Routes without `UserGuard` are public.
 */

interface AccessInfo {
  protectedByUserGuard: boolean;
  requiresMtls: boolean;
  excludedFromAuth: boolean;
  declaredRoles: UserRole[];
}

const ACCESS_HEADING = '**Access**';

const hasGuard = (guards: unknown[] | undefined, name: string): boolean =>
  (guards ?? []).some(
    (guard) =>
      (typeof guard === 'function' && guard.name === name) ||
      (typeof guard === 'object' &&
        guard !== null &&
        guard.constructor?.name === name)
  );

const collectAccessInfo = (
  controller: Type<unknown>,
  methodName: string
): AccessInfo => {
  const handler = controller.prototype[methodName];
  const guards: unknown[] = [
    ...(Reflect.getMetadata(GUARDS_METADATA, controller) ?? []),
    ...(Reflect.getMetadata(GUARDS_METADATA, handler) ?? []),
  ];
  const declaredRoles: UserRole[] =
    Reflect.getMetadata(ROLES_KEY, handler) ??
    Reflect.getMetadata(ROLES_KEY, controller) ??
    [];

  return {
    protectedByUserGuard: hasGuard(guards, 'UserGuard'),
    requiresMtls: hasGuard(guards, 'MtlsGuard'),
    excludedFromAuth: Reflect.getMetadata(EXCLUDED_ROUTE, handler) === true,
    declaredRoles,
  };
};

const PRIMITIVE_TYPES: unknown[] = [String, Number, Boolean, Object, Array];

/**
 * The global ValidationPipe only validates handler arguments typed with a
 * class (DTO). Arguments typed as primitives or `any` are passed through, so
 * a generic 400 is only documented when at least one DTO argument exists.
 */
const hasDtoParameter = (
  controller: Type<unknown>,
  methodName: string
): boolean => {
  const paramTypes: unknown[] =
    Reflect.getMetadata('design:paramtypes', controller.prototype, methodName) ??
    [];

  return paramTypes.some(
    (type) =>
      typeof type === 'function' &&
      !PRIMITIVE_TYPES.includes(type) &&
      !/^(Request|Response|IncomingMessage|ServerResponse)$/.test(type.name)
  );
};

const describeAccess = (info: AccessInfo): string => {
  const lines: string[] = [];

  if (!info.protectedByUserGuard || info.excludedFromAuth) {
    lines.push(
      '- Public: no login token or API key needed.'
    );
  } else {
    const messagingAllowed = info.declaredRoles.includes(UserRole.MESSAGING);
    lines.push(
      '- Login token (`Authorization: Bearer`) or API key (`x-api-key`), when `USER_AUTH_ENABLED=true`.'
    );
    lines.push(
      `- Roles: \`admin\`, \`superadmin\`${
        messagingAllowed ? ', `messaging`' : ''
      }.`
    );
  }

  if (info.requiresMtls) {
    lines.push(
      '- Needs the gateway certificate to be uploaded, otherwise `403 DHCG::UNAUTHORIZED`.'
    );
  }

  return `${ACCESS_HEADING}\n\n${lines.join('\n')}`;
};

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ResponseErrorDto) },
    },
  },
});

const addErrorResponses = (
  operation: OperationObject,
  info: AccessInfo,
  hasValidatedInput: boolean
): void => {
  const responses: ResponsesObject = operation.responses ?? {};

  if (hasValidatedInput && !responses['400']) {
    responses['400'] = errorResponse(
      'Request validation failed (`VALIDATION::FAILED`). `err.additionalDetails.errors` lists every failed constraint.'
    );
  }

  if (
    (info.protectedByUserGuard && !info.excludedFromAuth) ||
    info.requiresMtls
  ) {
    if (!responses['403']) {
      responses['403'] = errorResponse(
        'Access denied (`DHCG::UNAUTHORIZED`): missing, expired or invalid credentials, a role that is not allowed on this endpoint, or mTLS could not be configured.'
      );
    }
  }

  if (!responses['500']) {
    responses['500'] = errorResponse(
      'Unexpected error (`DHCG::UNKNOWN`) or an upstream failure reported by the message broker / SSI Hub (`DDHUB::*`, `MB::*`, `IAM::*`, ...). See `err.code` and `err.reason`.'
    );
  }

  operation.responses = responses;
};

export const enrichSwaggerDocument = (
  app: INestApplication,
  document: OpenAPIObject
): OpenAPIObject => {
  const operationsById = new Map<string, OperationObject>();

  Object.values(document.paths).forEach((pathItem) =>
    Object.values(pathItem).forEach((operation: OperationObject) => {
      if (operation && operation.operationId) {
        operationsById.set(operation.operationId, operation);
      }
    })
  );

  const modules = app.get(ModulesContainer);

  modules.forEach((module) => {
    module.controllers.forEach((wrapper) => {
      const controller = wrapper.metatype as Type<unknown>;

      if (!controller || !controller.prototype) {
        return;
      }

      Object.getOwnPropertyNames(controller.prototype)
        .filter((name) => name !== 'constructor')
        .forEach((methodName) => {
          const operation = operationsById.get(
            `${controller.name}_${methodName}`
          );

          if (!operation) {
            return;
          }

          const info = collectAccessInfo(controller, methodName);
          const isPublic =
            !info.protectedByUserGuard || info.excludedFromAuth;

          operation.security = isPublic
            ? []
            : [{ [SECURITY_BEARER]: [] }, { [SECURITY_API_KEY]: [] }];

          operation['x-access'] = {
            public: isPublic,
            roles: isPublic
              ? []
              : [
                  UserRole.ADMIN,
                  UserRole.SUPERADMIN,
                  ...(info.declaredRoles.includes(UserRole.MESSAGING)
                    ? [UserRole.MESSAGING]
                    : []),
                ],
            mtls: info.requiresMtls,
          };

          const access = describeAccess(info);
          if (!(operation.description ?? '').includes(ACCESS_HEADING)) {
            operation.description = operation.description
              ? `${operation.description}\n\n${access}`
              : access;
          }

          const hasValidatedInput = hasDtoParameter(controller, methodName);

          addErrorResponses(operation, info, hasValidatedInput);
        });
    });
  });

  return document;
};
