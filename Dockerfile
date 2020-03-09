# Stage 1

FROM node:13-alpine as node

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=development

RUN npm i -g angular/cli -y

RUN npm i -y

CMD npm start -y

# Stage 2

FROM nginx:1.13.12-alpine

COPY --from=node /usr/src/app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'