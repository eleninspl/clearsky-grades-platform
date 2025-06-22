const axios = require('axios');
const { publishCreditPurchased } = require('../rabbitmq');

const CREDITS_SERVICE_URL = process.env.CREDITS_SERVICE_URL;

const forward = async (req, res, method, path, data = null, afterSuccess = null) => {
  try {
    const config = {
      method,
      url: `${CREDITS_SERVICE_URL}/credits${path}`,
      headers: { Authorization: req.headers.authorization },
      data,
      params: req.query,
    };

    const response = await axios(config);

    // Εκτέλεσε post-success ενέργεια αν έχει δοθεί
    if (afterSuccess) {
      await afterSuccess(response.data, req);
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[Credits ${method.toUpperCase()} ${path}]`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || 'Credits service error',
    });
  }
};

// Controllers
exports.getBalance = (req, res) => forward(req, res, 'get', `/${req.params.institutionId}/balance`);

exports.buyCredits = (req, res) =>
  forward(
    req,
    res,
    'post',
    `/${req.params.institutionId}/buy`,
    req.body,
    async (responseData, req) => {
      // Κάνε publish στο RabbitMQ μετά την επιτυχή αγορά
      await publishCreditPurchased({
        institutionId: req.params.institutionId,
        userId: req.body.userId,
        amount: req.body.amount,
        purchasedAt: new Date().toISOString(),
        transactionId: responseData.transactionId ?? null,
      });
    }
  );

exports.getHistory = (req, res) => forward(req, res, 'get', `/${req.params.institutionId}/history`);
