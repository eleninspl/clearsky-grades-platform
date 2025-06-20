// src/controllers/creditsController.js
const pool = require('../db');
const axios = require('axios');

exports.getBalance = async (req, res) => {
  const { institutionId } = req.params;
  const token = req.headers.authorization;
  try {
    const response = await axios.get(
      `http://institution-service:5003/institutions/${institutionId}`,
      { headers: { Authorization: token } }
    );
    res.json({ credits_balance: response.data.credits_balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Institution service error' });
  }
};

exports.buyCredits = async (req, res) => {
  const { institutionId } = req.params;
  const { amount } = req.body;
  const token = req.headers.authorization;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid credit amount' });
  }

  try {
    // Καταγραφή συναλλαγής
    await pool.query(
      `INSERT INTO credit_transaction (institution_id, amount, tx_type, description)
       VALUES ($1, $2, 'PURCHASE', 'Buy credits')`,
      [institutionId, amount]
    );

    // Ενημέρωση balance μέσω institution-service
    const instRes = await axios.patch(
      `http://institution-service:5003/institutions/${institutionId}/credits`,
      { delta: amount },
      { headers: { Authorization: token } }
    );

    res.json({
      message: 'Credits added',
      new_balance: instRes.data.credits_balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.consumeCredit = async (req, res) => {
  const { institutionId } = req.params;
  const token = req.headers.authorization;

  try {
    // Ενημέρωση balance μέσω institution-service (αφαίρεση 1 credit)
    const instRes = await axios.patch(
      `http://institution-service:5003/institutions/${institutionId}/credits`,
      { delta: -1 },
      { headers: { Authorization: token } }
    );

    if (instRes.data.credits_balance < 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Καταγραφή συναλλαγής
    await pool.query(
      `INSERT INTO credit_transaction (institution_id, amount, tx_type, description)
       VALUES ($1, -1, 'CONSUME', 'Consumed 1 credit')`,
      [institutionId]
    );

    res.json({ message: 'Credit consumed', remaining: instRes.data.credits_balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getHistory = async (req, res) => {
  const { institutionId } = req.params;

  try {
    const result = await pool.query(`
      SELECT tx_type, amount, created_at
      FROM credit_transaction
      WHERE institution_id = $1
      ORDER BY created_at DESC
    `, [institutionId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
