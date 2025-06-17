FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY .env .env

RUN npm install axios
EXPOSE 5008
CMD ["node", "src/index.js"]
