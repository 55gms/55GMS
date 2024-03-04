FROM node:iron-bookworm-slim

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
