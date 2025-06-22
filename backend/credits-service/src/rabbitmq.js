const amqp = require('amqplib');
const pool = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function initConsumer() {
  let retries = 5;

  while (retries) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      const channel = await conn.createChannel();

      await channel.assertQueue('grades_uploaded', { durable: true });
      console.log('🎧 Listening for grades_uploaded...');

      channel.consume('grades_uploaded', async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        console.log('📥 grades_uploaded:', data);

        try {
          const { institution_id } = data;
          if (!institution_id) throw new Error('Missing institution_id');

          await pool.query(
            `INSERT INTO credits_service.credit_transaction (
              institution_id, amount, tx_type
            ) VALUES ($1, -1, 'CONSUME')`,
            [institution_id]
          );

          console.log(`✅ Credit consumed for institution ${institution_id}`);
          channel.ack(msg);
        } catch (err) {
          console.error('❌ Error in grades_uploaded:', err);
          channel.nack(msg, false, false);
        }
      });

      break; // ✅ Έγινε σύνδεση, βγαίνουμε από το loop
    } catch (err) {
      retries--;
      console.error(`❌ RabbitMQ not ready. Retrying in 5s... (${retries} attempts left)`);
      await sleep(5000);
    }
  }

  if (retries === 0) {
    console.error('❌ Failed to connect to RabbitMQ after multiple attempts.');
  }
}

module.exports = { initConsumer };
