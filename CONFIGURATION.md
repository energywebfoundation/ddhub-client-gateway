# Configuration

The DSB Client Gateway is configured via environment variables.

## Server

The following variables control the setup of the gateway server.

### `PORT` [optional]

Define the port the gateway will run on.

**Default**: 3000

### `WEBSOCKET` [optional]

Select WebSocket mode depending on architecture (i.e. preference for inbound
or outbound connections).

If set to `SERVER`, the gateway will run a WebSocket server on /events which
accepts clients requesting the subprotocol `dsb-messages`. If the gateway has
been configured to use basic authentication, this should also be provided in
the request header when initialising the WebSocket connection.

If set to `CLIENT`, the gateway will act as a WebSocket client. Additional
environment variables are needed to configure the client to connect to the right
server. See the below documentation for `WEBSOCKET_URL` and
`WEBSOCKET_PROTOCOL`.

*Options: `SERVER`, `CLIENT`, `NONE`*

**Default**: `NONE`

### `WEBSOCKET_URL` [optional]

Sets the URL of the WebSocket server the client should try to connect to.

**Required if `WEBSOCKET` is set to `CLIENT`**

### `WEBSOCKET_PROTOCOL` [optional]

Sets the protocol the WebSocket client should request access to. Acceptable
protocols are defined by the WebSocket server, however, this can also be left
undefined.

Note that if `WEBSOCKET` is set to `SERVER` this variable is ignored. The
server will only accept connection requests on the `dsb-messages` protocol.

### `WEBSOCKET_RECONNECT` [optional]

Define whether the WebSocket client should reconnect on connection error/close.

**Default**: `true`

### `WEBSOCKET_RECONNECT_TIMEOUT` [optional]

Define the interval between receiving a connection error/close and attempting
to reconnect, in milliseconds.

**Default**: `10000` (10s)

### `WEBSOCKET_RECONNECT_MAX_RETRIES` [optional]

Define how many times the WebSocket client should attempt reconnection with the
server upon receving connection error/close.

**Default**: `10`

## Events

The following variables control how the DSB Client Gateway reacts to events,
for example, incoming messages on a channel. This is used in conjunction with
the WebSocket configuration to define how data is pushed to connections.

### `EVENTS_EMIT_MODE` [optional]

Defines the format for messages pushed over a real-time communication channel.

If bulk mode is chosen, messages will be sent as an array. At every 1 second
interval, the gateway will emit an array of the latest messages received.

If single mode is chosen, messages will be sent individually.

*Options*: `BULK`, `SINGLE`

**Default**: `BULK`

### `EVENTS_MAX_PER_SECOND` [optional]

Defines how many events should be pushed per second, regardless of mode chosen
(see above).

**Default**: `100`

## DSB Message Broker

The following variables control the connection with the DSB Message Broker,
which is a required dependency of the gateway.

### `DSB_BASE_URL` [optional]

The URL of the DSB Message Broker you want to connect to. Trailing `/` allowed.

Examples:
- `http://localhost:3000/`
- `http://1.1.1.1:5000`
- `https://broker.example.com/`

**Default**: `http://dsb-demo.energyweb.org`

## Storage

The following variables define the storage mechanism for persisted data.
Note that as of writing, only JSON file is supported.

### `IN_MEMORY_DB_FILENAME` [optional]

Sets the filename of the JSON file the DSB Client Gateway will write to. The
file will be written to the current working directory (subject to change).

**Default**: `in-memory.json`

## Identity Access Management

These variables configure IAM on the Volta/Energy Web
Chain.

### `CHAIN_ID` [optional]

Sets the chain ID of the blockchain network.

*Options*: `73799` (Volta), `246` (EWC)

**Default**: `73799` (Volta)

### `RPC_URL` [optional]

Sets the blockchain RPC node to connect to retreive state from and submit
transactions to. Should match the network given in `CHAIN_ID`.

**Default**: `https://volta-rpc.energyweb.org/`

### `CACHE_SERVER_URL` [optional]

Sets the Energy Web IAM cache server URL, used to cache identities (as it
can be expensive to rely only on querying smart contract data).

**Default**: `https://identitycache-dev.energyweb.org/`

### `EVENT_SERVER_URL` [optional]

Sets the Energy Web IAM events server URL, used to receive notification of
approved DSB role claims.

**Default**: `https://identityevents-dev.energyweb.org/`

### `PARENT_NAMESPACE` [optional]

Sets the Energy Web IAM application namespace. DSB related roles, such as
`user` and `messagebroker` should fall under this namespace.

**Default**: `dsb.apps.energyweb.iam.ewc`

### `PRIVATE_KEY` [optional]

Sets the private key that will be used by the DSB Client Gateway. This will
also check the balance and enrolment state on startup.

Note that this will **overwrite** the current identity stored by the gateway.
