# Stage 1

FROM node:13-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -y

COPY . .

RUN npm run build

# Stage 2

FROM nginx:1.13.12-alpine

COPY --from=node /usr/src/app/dist/generator /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]