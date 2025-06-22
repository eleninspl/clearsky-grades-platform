const axios = require('axios');
const { publishCreditPurchased } = require('../rabbitmq');

const CREDITS_SERVICE_URL = process.env.CREDITS_SERVICE_URL;

// ── Helper: Forward request to Credits Service ──
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

    if (afterSuccess) {
      await afterSuccess(response.data, req);
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || 'Credits service error';

    console.error(`[Credits ${method.toUpperCase()} ${path}]`, message);
    res.status(status).json({ error: message });
  }
};

// ── Controller methods ─────────────

// GET /:institutionId/balance
exports.getBalance = (req, res) =>
  forward(req, res, 'get', `/${req.params.institutionId}/balance`);

// POST /:institutionId/buy
exports.buyCredits = (req, res) =>
  forward(
    req,
    res,
    'post',
    `/${req.params.institutionId}/buy`,
    req.body,
    async (responseData, req) => {
      // Publish credit purchase event
      await publishCreditPurchased({
        institutionId: req.params.institutionId,
        userId: req.body.userId,
        amount: req.body.amount,
        purchasedAt: new Date().toISOString(),
        transactionId: responseData.transactionId ?? null,
      });
    }
  );

// GET /:institutionId/history
exports.getHistory = (req, res) =>
  forward(req, res, 'get', `/${req.params.institutionId}/history`);
