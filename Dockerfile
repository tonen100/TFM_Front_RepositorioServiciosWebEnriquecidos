FROM node:13.14 as builder
COPY package.json ./
RUN yarn install && mkdir /api-repository && mv ./node_modules ./api-repository
WORKDIR /api-repository
COPY . .
RUN yarn run build --prod --build-optimizer

FROM nginx:1.13.9-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /api-repository/dist/api-repository /usr/share/nginx/html
COPY --from=builder /api-repository/entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh
RUN chmod +rx /usr/share/nginx/html/*
CMD ["/bin/sh", "/usr/share/nginx/entrypoint.sh"]