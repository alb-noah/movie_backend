# BUILDING STAGE
FROM node:17.6.0-alpine3.15 as builder

WORKDIR /home/smdb
COPY package.json .
COPY package-lock.json .
RUN  npm install \
    && npm cache clean --force
COPY --chown=node:node . .

RUN npm run build

# PRODUCTION STAGE
FROM node:17.6.0-alpine3.15 as production
ENV NODE_ENV=production
WORKDIR /home/smdb

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

COPY package.json .
COPY package-lock.json .

RUN  npm ci \
     && npm install -g knex@^2.1.0\
     && npm cache clean --force

COPY --from=builder /home/smdb/build .

EXPOSE 8022

CMD [ "node", "./src/index.js" ]
