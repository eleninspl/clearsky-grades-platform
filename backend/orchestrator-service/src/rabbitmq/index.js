const { initRabbit } = require('./connection');
const { publishUserCreated } = require('./publishers/authPublisher');

module.exports = {
  initRabbit,
  publishUserCreated
};
