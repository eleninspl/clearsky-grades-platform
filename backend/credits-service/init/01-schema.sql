-- ENUM για τύπους συναλλαγών
CREATE TYPE credit_tx_type AS ENUM ('PURCHASE', 'CONSUME', 'REFUND');

-- Πίνακας συναλλαγών
CREATE TABLE credit_transaction (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  tx_type credit_tx_type NOT NULL,
  description TEXT,
  reference VARCHAR(60),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER
);

-- Index για πιο γρήγορα queries στο ιστορικό
CREATE INDEX idx_ct_inst_date ON credit_transaction (institution_id, created_at DESC);