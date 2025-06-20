-- Εγγραφές συναλλαγών για testing
-- Θεωρείται ότι υπάρχουν ήδη institutions με id = 1 και 2 στο institution-service

INSERT INTO credit_transaction (institution_id, amount, tx_type, description, reference, created_by)
VALUES 
  (1, 10, 'PURCHASE', 'Initial load for NTUA', 'NTUA_INIT_2025', 1),
  (1, -1, 'CONSUME', 'Used 1 credit for upload', 'NTUA_COURSE101', 1),
  (2, 5, 'PURCHASE', 'AUTH credits for spring', 'AUTH_SPRING_2025', 2);
