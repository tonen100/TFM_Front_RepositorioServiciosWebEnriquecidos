FROM node:13
WORKDIR /app
COPY . .
ENV NODE_ENV=development
EXPOSE 4200
RUN npm i -y
RUN npm i -g angular/cli -y
CMD npm start -y