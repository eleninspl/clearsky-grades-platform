-- 📌 Institutions
INSERT INTO credits_service.institution (id, name, email, credits_balance)
VALUES
    (1, 'National Technical University of Athens', 'ntua@example.gr', 10),
    (2, 'University of Crete', 'uoc@example.gr', 5),
    (3, 'Aristotle University of Thessaloniki', 'auth@example.gr', 0)
ON CONFLICT (id) DO NOTHING;

-- 📌 Credit Transactions (mixed types)
INSERT INTO credits_service.credit_transaction ( institution_id, amount, tx_type )
VALUES
    -- NTUA buys 10 credits
    (1, 10, 'PURCHASE'),

    -- NTUA consumes 1 credit for CS101 upload
    (1, -1, 'CONSUME'),

    -- NTUA consumes 1 credit (e.g. error)
    (1, 1, 'CONSUME'),

    -- UoC buys 5 credits
    (2, 5, 'PURCHASE'),

    -- AUTH tries to consume with 0 balance (should fail in prod if validated)
    (3, -1, 'CONSUME')
ON CONFLICT DO NOTHING;

-- Optional: reset sequence if using SERIAL and manual IDs
SELECT setval('credits_service.institution_id_seq', (SELECT MAX(id) FROM credits_service.institution));
SELECT setval('credits_service.credit_transaction_id_seq', (SELECT MAX(id) FROM credits_service.credit_transaction));