const pool = require('../db'); // Βεβαιώσου ότι έχεις db connection (π.χ. με pg.Pool)

// GET /:institutionId/balance
const getBalance = async (req, res) => {
  const { institutionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT credits_balance FROM credits_service.institution WHERE id = $1',
      [institutionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json({ balance: result.rows[0].credits_balance });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// POST /:institutionId/buy
const buyCredits = async (req, res) => {
  const { institutionId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    await pool.query(
      `INSERT INTO credits_service.credit_transaction 
        (institution_id, amount, tx_type) 
       VALUES ($1, $2, 'PURCHASE')`,
      [institutionId, amount]
    );
    res.status(201).json({ message: 'Credits purchased' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// GET /:institutionId/history
const getHistory = async (req, res) => {
  const { institutionId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, amount, tx_type, created_at 
       FROM credits_service.credit_transaction 
       WHERE institution_id = $1 
       ORDER BY created_at DESC`,
      [institutionId]
    );

    const transactions = result.rows.map(tx => {
      let description = '';
      switch (tx.tx_type) {
        case 'PURCHASE':
          description = `Purchased ${tx.amount} credit(s)`;
          break;
        case 'CONSUME':
          description = `Consumed ${Math.abs(tx.amount)} credit(s)`;
          break;
        default:
          description = 'Unknown transaction';
      }

      return {
        ...tx,
        description
      };
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};


module.exports = {
  getBalance,
  buyCredits,
  getHistory
};
