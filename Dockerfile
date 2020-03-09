FROM node:13
WORKDIR /app
COPY . .
ENV NODE_ENV=development
EXPOSE 4200
CMD npm i && npm start