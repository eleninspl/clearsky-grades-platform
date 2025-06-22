const amqp = require('amqplib');
const pool = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Init RabbitMQ consumers ──
exports.initConsumer = async () => {
  let retries = 5;

  while (retries) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      const channel = await conn.createChannel();

      // 🔔 Consumer: user_created
      await channel.assertQueue('user_created', { durable: true });
      console.log('🎧 Listening for user_created...');

      channel.consume('user_created', async (msg) => {
        if (!msg) return;
        const data = JSON.parse(msg.content.toString());
        console.log('📥 user_created:', data);

        try {
          const { userId, email, role, username, full_name, institution_id, am } = data;
          const existing = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);

          if (!existing.rowCount) {
            await pool.query(
              `INSERT INTO users (id, username, email, full_name, role, am, institution_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [userId, username || `user_${userId}`, email, full_name || email.split('@')[0], role, am, institution_id || 1]
            );
            console.log(`✅ Inserted user: ${email}`);
          } else {
            console.log(`ℹ️ User exists: ${userId}`);
          }

          channel.ack(msg);
        } catch (err) {
          console.error('❌ Error in user_created:', err);
          channel.nack(msg, false, false);
        }
      });

      // 🔔 Consumer: credit.purchased
      await channel.assertQueue('credit.purchased', { durable: true });
      console.log('🎧 Listening for credit.purchased...');

      channel.consume('credit.purchased', async (msg) => {
        if (!msg) return;
        const data = JSON.parse(msg.content.toString());
        console.log('📥 credit.purchased:', data);

        try {
          const { institutionId, amount } = data;
          if (!institutionId || !amount) throw new Error('Missing institutionId or amount');

          await pool.query(
            `UPDATE institution SET credits_balance = credits_balance + $1 WHERE id = $2`,
            [amount, institutionId]
          );

          console.log(`✅ Institution ${institutionId} credited +${amount}`);
          channel.ack(msg);
        } catch (err) {
          console.error('❌ Error in credit.purchased:', err);
          channel.nack(msg, false, false);
        }
      });

      break; // ✅ exit retry loop if connected
    } catch (err) {
      retries--;
      console.error(`❌ RabbitMQ not ready. Retrying in 5s... (${retries} left)`);
      await sleep(5000);
    }
  }

  if (!retries) console.error('❌ Failed to connect to RabbitMQ');
};
