FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install axios
COPY ./src ./src
COPY .env .env

EXPOSE 5006
CMD ["node", "src/index.js"]
