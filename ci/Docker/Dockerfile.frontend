ARG IMAGE=node:14.17-alpine
ARG NODE_ENV=production

FROM $IMAGE as build
ENV CYPRESS_INSTALL_BINARY false

WORKDIR /usr/usr/app

COPY . .

ENV NODE_ENV $NODE_ENV

RUN npm install --quiet --no-progress -g nx && \
    npm ci --quiet --no-progress \

CMD ["nx", "serve", "dsb-client-gateway-frontend"]
