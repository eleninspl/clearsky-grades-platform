const { initRabbit } = require('./connection');
const { publishUserCreated } = require('./publishers/authPublisher');
const { publishCreditPurchased } = require('./publishers/creditsPublisher');

module.exports = {
  initRabbit,
  publishUserCreated,
  publishCreditPurchased
};
