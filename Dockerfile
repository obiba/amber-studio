#
# Amber Studio Dockerfile
#

# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
COPY . .

# build stage
FROM develop-stage as build-stage
ARG AMBER_URL
ARG RECAPTCHA_SITE_KEY
RUN yarn
RUN yarn quasar build

# production stage
FROM nginx:alpine as production-stage
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
