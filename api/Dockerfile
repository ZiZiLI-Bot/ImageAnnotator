FROM nikolaik/python-nodejs:python3.11-nodejs18-slim as node

FROM node as server-dependences
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --production=true

#3 Build app
FROM node as server-builder
WORKDIR /app
COPY . .
COPY --from=server-dependences /app/node_modules /app/node_modules
RUN yarn install --production=false
RUN yarn build

#4 Run app
FROM node as server
ENV NODE_ENV=production
WORKDIR /app
COPY --from=server-dependences /app/node_modules /app/node_modules
COPY --from=server-builder /app/package.json /app/package.json
COPY --from=server-builder /app/.env /app/
COPY --from=server-builder /app/dist /app/dist
COPY --from=server-builder /app/public /app/public
COPY --from=server-builder /app/src/services/DetectV8.service.py /app/dist/services/DetectV8.service.py
COPY --from=server-builder /app/src/assets /app/dist/assets
COPY --from=server-builder /app/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
CMD [ "node", "--experimental-modules", "--es-module-specifier-resolution=node", "dist/main.js" ]