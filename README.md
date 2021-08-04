# DSB Client Gateway

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Config

- `.env.development` -> points to a running instance of DSB
- `.env.production` -> points to an instance of DSB on localhost

For the full configuration options see [Configuration](./CONFIGURATION.md).

## Container

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
docker build -t aemo-gateway .

# run the container
docker run --rm -it -p 3001:3001 -e NATS_JS_URL=nats://20.83.92.252:4222 aemo-gateway
```
