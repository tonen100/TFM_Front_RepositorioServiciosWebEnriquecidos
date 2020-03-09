FROM node:13
WORKDIR /app
COPY . .
ENV NODE_ENV=development
EXPOSE 4200
CMD npm i -y && npm i -g angular/cli -y && npm start -y