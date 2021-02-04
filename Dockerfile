FROM node:14
WORKDIR /usr/src/4devs-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3333
CMD npm start