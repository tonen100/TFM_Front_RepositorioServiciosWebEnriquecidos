# Stage 1

FROM node:13-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -y

COPY . .

EXPOSE 4200

CMD npm start