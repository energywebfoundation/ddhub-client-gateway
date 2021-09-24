# DSB Client Gateway

The DSB Client Gateway acts as a client to the DSB, enabling easier integration.

## Quickstart

The simplest way to run the gateway is via the public Docker container stored
in the Azure container registry.

```
docker run -p 3000:3000 -e NATS_JS_URL=nats://20.83.92.252:4222 aemocontainerregistry.azurecr.io/dsb/client-gateway:latest
```

The gateway UI can now be accessed on http://localhost:3000.

> Note: use the `--init` flag if passing SIGINT signals (ctrl+c) to the container
  fails. See [here](https://docs.docker.com/engine/reference/run/#specify-an-init-process)
  for documentation.

> Note: environment variables can be specified using `-e` flags. See
  [here](https://docs.docker.com/engine/reference/run/#env-environment-variables)
  for documentation.
### Persisting Data

By default, the gateway will not persist data configured during runtime
(e.g. identity, cerficates). To do this, a Docker bind mount can be used with
the following flag:

```
-v $(pwd)/in-memory.json:/var/deployment/apps/dsb-client-gateway/in-memory.json
```

This will bind the container's `in-memory.json` file to the host filesystem.
Make sure that the file exists on the host filesystem first.
See [here](https://docs.docker.com/engine/reference/run/#volume-shared-filesystems)
for full documentation.

If you want to run sentry in docker image then please include the following environment variables while running the docker container

```
-e NEXT_PUBLIC_SENTRY_ENABLED=true -e NEXT_PUBLIC_SENTRY_DSN=<SENTRY_DSN>
``` 

There are 2 options availbale for sentry logs(message logs and error logs) if you want to enable only error logs 

```
-e SENTRY_LOG_ERROR=true
``` 

if you want to enable only message logs 
```
-e SENTRY_LOG_MESSAGE=true
``` 
if you want to enable both message logs and error logs 
```
-e SENTRY_LOG_MESSAGE=true -e SENTRY_LOG_ERROR=true
``` 

### Configuration

The DSB Client Gateway can be configured in a number of ways.

For the full configuration options see [Configuration](./CONFIGURATION.md).

### Testing WebSockets

The gateway supports WebSockets for bidirectional communication. You can use
[wscat](https://github.com/websockets/wscat) to easily receiving and sending
messages over WebSockets.

If running the gateway in WebSocket server mode, connect via
```
wscat --connect ws://localhost:3000/events --subprotocol dsb-messages
```

If you have configured the gateway to use basic authentication, supply the
following flag in addition to the above command
```
--auth {username}:{password}
```

If running the gateway in WebSocket client mode, start a server with
```
wscat --listen 5001
```

Be sure to now set your gateway's `WEBSOCKET_URL` to ws://localhost:5001/.

> Note: if running the Docker container, replace localhost with
  host.docker.internal (windows, macOS). On Linux run the container with
  `--net=host` to directly access localhost.

With wscat running, you should be able to start receiving messages once the
gateway's DSB enrolment is complete.

### Sentry

The gateway supports sentry integration for capturing logs, transactions, Performance Monitoring

#### Install
Sentry captures data by using an SDK within your application’s runtime.

```
yarn add @sentry/nextjs
```
## Development

Install dependencies:
```
yarn
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Config

- `.env` -> applies to all environments
- `.env.development` -> points to a running instance of DSB
- `.env.production` -> points to an instance of DSB on localhost
- `.env.test` -> applies only on `yarn test`
- `.env.local` -> local overrides (do not commit to source control)

### Building the Container

This gateway is currently being shipped as a single docker container. To build
the image:

```sh
# using access credentials
aws configure

# login to ecr (so we can fetch latest dsb base image)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 098061033856.dkr.ecr.us-east-1.amazonaws.com

# build the container
docker build -t dsb-client-gateway .
```

## Updating REST/WebSocket Documentation

Please keep the documentation up to date! Unfortunately, this is manual right now.

### REST (OpenAPI)

Visit https://editor.swagger.io/ or run locally (localhost:8080):

```
docker pull swaggerapi/swagger-editor
docker run -p 8080:8080 swaggerapi/swagger-editor
```

Now import the existing specification (`public/rest.yaml`) to begin editing.

### WebSocket (AsyncAPI)

Visit https://playground.asyncapi.io/ and import the existing specification
(`public/ws.yaml`) to begin editing.
