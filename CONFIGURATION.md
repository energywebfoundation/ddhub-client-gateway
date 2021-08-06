# Configuration

The DSB Client Gateway is configured via environment variables.

### `PORT` [optional]

Define the port the gateway will run on.

**Default**: 3000

## DSB Message Broker

The following variables control the connection with the DSB Message Broker,
which is a required dependency of the gateway.

### `DSB_BASE_URL` [optional]

The URL of the DSB Message Broker you want to connect to. Trailing `/` allowed.

Examples:
- `http://localhost:3000/`
- `http://1.1.1.1:5000`
- `https://broker.example.com/`

**Default**: `http://dsb-dev.energyweb.org`

### `DSB_CONTROLLABLE` [optional]

This allows the DSB Message Broker to be controlled by the DSB Client Gateway.
In this situation, the identities of both components are shared. This means
that a single private key is used for each component and, in addition to the
`user` DSB role, the gateway will enrol itself as a `messagebroker`.

If a `DSB_CONTROL_TYPE` is also provided, the gateway may spawn a process
with the chosen method, in order to configure it (i.e. setting the same
private key).

**Default**: `false`

### `DSB_CONTROL_TYPE` [optional]

Used in conjunction with `DSB_CONTROLLABLE`, the `DSB_CONTROL_TYPE` defines
how the DSB Client Gateway controls the DSB Message Broker.

*Options*: `pm2`

By default this is unset.

### `DSB_PM2_PROCESS_NAME` [optional]

If `DSB_CONTROL_TYPE` is set to `pm2`, set the name of the DSB Message Broker
process which will be controlled by the gateway.

**Default**: `dsb-message-broker`

### `DSB_BIN_PATH` [optional]

Sets the path of the message broker to control if `DSB_CONTROL_TYPE` is set to
`pm2`. Can be relative (from the current working directory) or absolute. The
message broker must be built first for this to work.

**Default**: `../dsb-message-broker/bin/dsb-message-broker`

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

### `PARENT_NAMESPACE` [optional]

Sets the Energy Web IAM application namespace. DSB related roles, such as
`user` and `messagebroker` should fall under this namespace.

**Default**: `dsb.apps.energyweb.iam.ewc`
