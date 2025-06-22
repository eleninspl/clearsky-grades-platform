const { getChannel } = require('../connection');

const publishGradesUploaded = async ({ institution_id }) => {
  const channel = getChannel();

  if (!channel) {
    console.warn('⚠️ RabbitMQ channel not available');
    return;
  }

  if (!institution_id) {
    console.warn('⚠️ Incomplete data for grades_uploaded message');
    return;
  }

  const message = {
    event: 'grades_uploaded',
    institution_id,
    timestamp: new Date().toISOString()
  };

  channel.sendToQueue('grades_uploaded', Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

  console.log('✅ [gradesPublisher] Message sent to grades_uploaded queue');
};

module.exports = {
  publishGradesUploaded
};
