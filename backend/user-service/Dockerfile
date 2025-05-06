FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY .env .env

EXPOSE 5002
CMD ["node", "src/index.js"]
