# Stage 1

FROM node:13-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli -y

RUN npm install -y

COPY . .

CMD ng serve --host 0.0.0.0