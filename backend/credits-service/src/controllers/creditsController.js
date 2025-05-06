const pool = require('../db');

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
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid credit amount' });

  try {
    const result = await pool.query(`
      UPDATE clearsky.institution
      SET credits_balance = credits_balance + $1
      WHERE id = $2
      RETURNING credits_balance
    `, [amount, institutionId]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json({ message: 'Credits added', new_balance: result.rows[0].credits_balance });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.consumeCredit = async (req, res) => {
  const { institutionId } = req.params;

  try {
    const result = await pool.query(`
      UPDATE clearsky.institution
      SET credits_balance = credits_balance - 1
      WHERE id = $1 AND credits_balance > 0
      RETURNING credits_balance
    `, [institutionId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    res.json({ message: 'Credit consumed', remaining: result.rows[0].credits_balance });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
