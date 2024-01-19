# BUILD
FROM --platform=linux/amd64 node:latest AS build
USER margostino
ENV SERVICE_DIR /home/ai-gateway
RUN mkdir -p ${SERVICE_DIR}
WORKDIR ${SERVICE_DIR}
COPY --chown=margostino:margostino package.json ./package.json
COPY --chown=margostino:margostino yarn.lock ./yarn.lock
COPY --chown=margostino:margostino tsconfig.json ./tsconfig.json
COPY --chown=margostino:margostino src ./src
COPY --chown=margostino:margostino provision/server/config.toml ./config.toml
RUN yarn install --frozen-lockfile --production=false
RUN yarn build

# Expose the port the app will run on
EXPOSE 8080
EXPOSE 8081

CMD ["yarn", "start"]
