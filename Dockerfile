FROM node:16.3.0

WORKDIR /usr/src/app

ENV PORT 9001
ENV HOST 0.0.0.0
ENV SERVER_KEY $SERVER_KEY

COPY ./app/package*.json ./

RUN npm install --only=production

COPY ./app/. .

RUN npm run build

CMD npm start