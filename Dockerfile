FROM node:14
WORKDIR /usr/src/4devs-api
COPY ./package.json .
RUN npm install --only=prod