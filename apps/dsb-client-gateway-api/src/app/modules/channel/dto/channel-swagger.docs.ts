/**
 * Shared OpenAPI description texts for the channel DTOs.
 *
 * `create-channel.dto.ts` and `update-channel.dto.ts` both declare classes
 * named `TopicDto`, `ResponseTopicDto` and `ChannelConditionsDto`. Swagger
 * registers each class name as ONE schema, so the two declarations must stay
 * documented identically. Keep all shared wording here.
 *
 * Documentation only: nothing in this file affects runtime behaviour.
 */

export const FQCN_EXAMPLE = 'ewds.market.operator.pub';

export const FQCN_DESCRIPTION = 'Unique name of the channel in this gateway.';

export const FQCN_PARAM_DESCRIPTION = `FQCN (fully qualified channel name) of an existing channel. Only lowercase letters, digits and dots, 1 to 255 characters.`;

export const CHANNEL_TYPE_DESCRIPTION = [
  'Direction of the channel. Cannot be changed later.',
  '- `pub`: send messages. Topics `JSD7` or `XML`.',
  '- `sub`: receive messages. Topics `JSD7` or `XML`.',
  '- `upload`: send files. Topics `XSD6`, `CSV` or `TSV`.',
  '- `download`: receive files. Topics `XSD6`, `CSV` or `TSV`.',
].join('\n');

export const PAYLOAD_ENCRYPTION_DESCRIPTION = [
  'Encrypt what is sent on this channel.',
  '- `true`: only the recipients can read the messages or files (`pub` and `upload`).',
  '- `false`: sent in clear text, still signed.',
  '- Ignored on anonymous external channels and on `sub` / `download` channels.',
].join('\n');

export const MESSAGE_FORMS_DESCRIPTION = [
  'Keep a copy of the messages of this channel. Cannot be changed later.',
  '- `pub`: sent messages are kept.',
  '- `sub`: received messages are kept.',
  '- `upload`: the original file is kept.',
  '- `download`: received file messages are kept.',
  '- Message counts work only for channels with this enabled.',
  '- `false` (default): nothing is kept.',
].join('\n');

export const USE_ANONYMOUS_EXT_CHANNEL_DESCRIPTION = [
  'Exchange messages with parties addressed by association keys instead of DIDs. Cannot be changed later.',
  '- `true`, `pub`: sending works without recipients (use `anonymousRecipient`); never encrypted.',
  '- `true`, `sub` / `download`: messages for the current association key, not checked or decrypted.',
  '- `false` (default): normal messaging between DIDs.',
].join('\n');

export const CONDITIONS_DESCRIPTION = [
  'Who can exchange data on the channel (`dids`, `roles`) and on which topics (`topics`, `responseTopics`).',
  '- Send `conditions` and `conditions.topics` even when empty (`[]`).',
].join('\n');

export const CONDITIONS_DIDS_DESCRIPTION = [
  'DIDs allowed on the channel (recipients for `pub` and `upload`).',
  '- Format: `did:<method>:[<chain>:]0x<40 hex characters>`.',
  '- Send `[]` when not used.',
].join('\n');

export const CONDITIONS_ROLES_DESCRIPTION = [
  'Roles whose holders are allowed on the channel (any of the roles).',
  '- Lowercase letters, digits and dots, 1 to 255 characters.',
  '- New holders appear within about a minute.',
  '- Send `[]` when not used.',
].join('\n');

export const CONDITIONS_TOPICS_DESCRIPTION = [
  'Topics of the channel, by name and owner.',
  '- Each must exist on the Message Broker (`TOPIC::NOT_FOUND`).',
  '- `JSD7` or `XML` for `pub` and `sub`; `XSD6`, `CSV` or `TSV` for `upload` and `download`.',
  '- Each topic once. Send `[]` for none.',
].join('\n');

export const CONDITIONS_RESPONSE_TOPICS_DESCRIPTION = [
  'Reply mapping: messages on `responseTopicId` should be answered on `topicName` / `owner`.',
  '- Stored only; messages are not routed by it.',
  '- Optional on create; required on update (send `[]` when unused).',
].join('\n');

export const TOPIC_NAME_DESCRIPTION = 'Topic name, exactly as registered on the message broker.';
export const TOPIC_NAME_EXAMPLE = 'operatorEnvelope';
export const TOPIC_OWNER_DESCRIPTION =
  'Topic owner: the application namespace the topic belongs to.';
export const TOPIC_OWNER_EXAMPLE = 'ddhub.apps.energyweb.iam.ewc';
export const TOPIC_ID_EXAMPLE = '622fed6e4258501225095045';
export const RESPONSE_TOPIC_ID_DESCRIPTION =
  'Id of the topic of incoming messages that should be answered on `topicName` / `owner`.';

export const DID_EXAMPLE = 'did:ethr:volta:0x09Df5d33f1242E1b8aA5E0E0F6BfA687E6846993';
export const DID_EXAMPLE_2 = 'did:ethr:volta:0x3Ce3B60427b4Bf0Ce366d9963BeC5ef3CBD06ad5';
export const ROLE_EXAMPLE = 'marketoperator.roles.ddhub.apps.energyweb.iam.ewc';

export const QUALIFIED_DIDS_DESCRIPTION = [
  'DIDs allowed on the channel: the listed DIDs plus the holders of the listed roles.',
  '- For `pub` and `upload`, these are the recipients.',
  '- Updated about once a minute; empty until the gateway identity is set up.',
  '- Read only.',
].join('\n');
