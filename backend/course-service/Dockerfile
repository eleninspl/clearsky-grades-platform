FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install axios
COPY ./src ./src
COPY .env .env

CMD ["node", "src/index.js"]
