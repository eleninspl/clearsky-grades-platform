const { getChannel } = require('../connection');

const publishUserCreated = async (message) => {
  const channel = getChannel();

  if (!channel) {
    console.warn('⚠️ RabbitMQ channel not available');
    return;
  }

  if (!message.userId || !message.email || !message.role) {
    console.warn('⚠️ Incomplete user data for RabbitMQ message:', message);
    return;
  }

  channel.sendToQueue('user_created', Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

  console.log('✅ [authPublisher] Message sent to user_created queue');
};

module.exports = {
  publishUserCreated  // 👈 αυτό είναι κρίσιμο
};
