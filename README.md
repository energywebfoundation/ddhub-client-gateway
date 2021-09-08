# DSB Client Gateway

The DSB Client Gateway acts as a client to the DSB, enabling easier integration.

## Getting Started

Install dependencies:
```
yarn
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Config

The DSB Client Gateway can be configured in a number of ways.

For the full configuration options see [Configuration](./CONFIGURATION.md).

For developers:
- `.env` -> applies to all environments
- `.env.development` -> points to a running instance of DSB
- `.env.production` -> points to an instance of DSB on localhost
- `.env.test` -> applies only on `yarn test`
- `.env.local` -> local overrides (do not commit to source control)

## Testing WebSockets

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

With wscat running, you should be able to start receiving messages once the
gateway's DSB enrolment is complete.

## Building the Container

This gateway is currently being shipped as a single docker container. To build
the image:

```sh
# using access credentials  
aws configure

# login to ecr
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 098061033856.dkr.ecr.us-east-1.amazonaws.com

# pull the base image (e.g. the one in the Dockerfile)
docker pull 098061033856.dkr.ecr.us-east-1.amazonaws.com/ew-dos-dsb-ecr:{TAG}

# build the container
docker build -t dsb-client-gateway .

# run the container
docker run --rm -it -p 3000:3000 -p 3001:3001 -e NATS_JS_URL=nats://20.83.92.252:4222 dsb-client-gateway
```

The gateway UI should now be accessible on https://localhost:3000

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
