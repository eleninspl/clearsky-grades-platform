const amqp = require('amqplib');
const pool = require('./db');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initConsumer = async () => {
    let retries = 5;

    while (retries) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();

            // ============ Consumer 1: user_created ============
            await channel.assertQueue('user_created', { durable: true });
            console.log('🎧 [RabbitMQ] Listening for user_created messages...');

            channel.consume('user_created', async (msg) => {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    console.log('📥 Received user_created:', data);

                    try {
                        const {
                            userId,
                            email,
                            role,
                            username,
                            full_name,
                            institution_id,
                            am
                        } = data;

                        const existing = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
                        if (existing.rowCount === 0) {
                            await pool.query(
                                `INSERT INTO users (id, username, email, full_name, role, am, institution_id)
                                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                                [
                                    userId,
                                    username || `user_${userId}`,
                                    email,
                                    full_name || email.split('@')[0],
                                    role,
                                    am,
                                    institution_id || 1
                                ]
                            );
                            console.log(`✅ Inserted new user from RabbitMQ: ${email}`);
                        } else {
                            console.log(`ℹ️ User already exists: ${userId}`);
                        }

                        channel.ack(msg);
                    } catch (err) {
                        console.error('❌ Error handling user_created:', err);
                        channel.nack(msg, false, false);
                    }
                }
            });

            // ============ Consumer 2: credit.purchased ============
            await channel.assertQueue('credit.purchased', { durable: true });
            console.log('🎧 [RabbitMQ] Listening for credit.purchased messages...');

            channel.consume('credit.purchased', async (msg) => {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    console.log('📥 Received credit.purchased:', data);

                    try {
                        const { institutionId, amount } = data;

                        if (!institutionId || !amount) {
                            throw new Error('Missing institutionId or amount');
                        }

                        await pool.query(
                            `UPDATE institution
                             SET credits_balance = credits_balance + $1
                             WHERE id = $2`,
                            [amount, institutionId]
                        );

                        console.log(`✅ Updated institution ${institutionId} with +${amount} credits.`);
                        channel.ack(msg);
                    } catch (err) {
                        console.error('❌ Error handling credit.purchased:', err);
                        channel.nack(msg, false, false); // discard if fail
                    }
                }
            });

            break; // ✅ έξοδος από το retry loop αν όλα πάνε καλά
        } catch (err) {
            retries--;
            console.error(`❌ RabbitMQ not ready. Retrying in 5s... (${retries} left)`);
            await sleep(5000);
        }
    }

    if (!retries) {
        console.error('❌ Failed to connect to RabbitMQ after retries');
    }
};

module.exports = {
    initConsumer
};
