FROM node:13-alpine as builder
COPY package.json ./
RUN yarn install && mkdir /generator && mv ./node_modules ./generator
WORKDIR /generator
COPY . .
RUN yarn run build --prod --build-optimizer

FROM nginx:1.13.9-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /generator/dist/generator /usr/share/nginx/html
COPY --from=builder /generator/entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh
RUN chmod +rx /usr/share/nginx/html/*
CMD ["/bin/sh", "/usr/share/nginx/entrypoint.sh"]