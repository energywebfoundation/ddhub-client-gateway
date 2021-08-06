# DSB Client Gateway

The DSB Client Gateway acts as a client to the DSB, enabling easier integration.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Config

- `.env.development` -> points to a running instance of DSB
- `.env.production` -> points to an instance of DSB on localhost

For the full configuration options see [Configuration](./CONFIGURATION.md).

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

## Updating OpenAPI Documentation

Please keep the documentation up to date! Unfortunately, this is manual right now.

```
docker pull swaggerapi/swagger-editor
docker run -p 8080:8080 swaggerapi/swagger-editor
```

Visit http://localhost:8080 and import the existing specification
(`public/spec.json`) to begin editing.
