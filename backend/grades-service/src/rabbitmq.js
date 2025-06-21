// rabbitmq.js
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL;
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  console.log('✅ Connected to RabbitMQ');
  return channel;
}

async function publishToExchange(exchange, message, type = 'fanout') {
  if (!channel) throw new Error('Channel not initialized');

  await channel.assertExchange(exchange, type, { durable: false });
  channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
  console.log(`[→] Sent to ${exchange}:`, message);
}

async function consumeExchange(exchange, onMessage, type = 'fanout') {
  if (!channel) throw new Error('Channel not initialized');

  await channel.assertExchange(exchange, type, { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, msg => {
    const content = JSON.parse(msg.content.toString());
    console.log(`[←] Received from ${exchange}:`, content);
    onMessage(content);
  }, { noAck: true });
}

module.exports = {
  connectRabbitMQ,
  publishToExchange,
  consumeExchange
};
