const { getChannel } = require('../connection');

async function publishCreditPurchased(creditData) {
  const channel = getChannel();
  const queue = 'credit.purchased';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(creditData)));

  console.log('📤 Published credit purchase event to RabbitMQ:', creditData);
}

module.exports = { publishCreditPurchased };
