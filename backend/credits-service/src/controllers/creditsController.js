const pool = require('../db');
const axios = require('axios');

exports.getBalance = async (req, res) => {
  const { institutionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT credits_balance FROM clearsky.institution WHERE id = $1',
      [institutionId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.buyCredits = async (req, res) => {
  const { institutionId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid credit amount' });
  }

  try {
    const institutionExists = await pool.query(
      `SELECT id FROM clearsky.institution WHERE id = $1`,
      [institutionId]
    );

    if (institutionExists.rowCount === 0) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Καταγραφή συναλλαγής
    await pool.query(
      `INSERT INTO clearsky.credit_transaction (institution_id, amount, tx_type, description)
       VALUES ($1, $2, 'PURCHASE', 'Buy credits')`,
      [institutionId, amount]
    );

    // Ενημέρωση balance μέσω institution-service
    const token = req.headers.authorization;
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

  try {
    // Ενημέρωση balance μέσω institution-service (αφαίρεση 1 credit)
    const token = req.headers.authorization;
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
      `INSERT INTO clearsky.credit_transaction (institution_id, amount, tx_type, description)
      VALUES ($1, -1, 'CONSUME', 'Consumed 1 credit')`,
      [institutionId]
    );

    res.json({ message: 'Credit consumed', remaining: instRes.data.credits_balance });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getHistory = async (req, res) => {
  const { institutionId } = req.params;

  try {
    const result = await pool.query(`
      SELECT tx_type, amount, created_at
      FROM clearsky.credit_transaction
      WHERE institution_id = $1
      ORDER BY created_at DESC
    `, [institutionId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
