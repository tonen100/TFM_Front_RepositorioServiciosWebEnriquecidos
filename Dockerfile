FROM node:12.16 as builder
COPY package.json ./
RUN yarn install && mkdir /api-repository && mv ./node_modules ./api-repository
WORKDIR /api-repository
COPY . .
RUN yarn run build:ssr
EXPOSE 4000
CMD yarn run serve:ssr