#
# Amber Studio Dockerfile
#

# develop stage
FROM node:lts-alpine AS develop-stage
WORKDIR /app
COPY package*.json ./
COPY . .

# build stage
FROM develop-stage AS build-stage
RUN yarn
RUN yarn quasar build

# production stage
FROM nginx:alpine AS production-stage
RUN mkdir -p /etc/nginx/templates
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80

RUN apk add --no-cache bash
COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
