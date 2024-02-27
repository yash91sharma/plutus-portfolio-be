FROM node:21-alpine

WORKDIR /be

COPY package*.json ./
COPY dist/ ./

RUN npm install -g npm@latest
RUN npm install

CMD ["node","dist/server.js"]