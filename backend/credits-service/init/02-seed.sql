-- 📌 Institutions
INSERT INTO credits_service.institution (id, name, email, credits_balance)
VALUES
    (1, 'National Technical University of Athens', 'ntua@example.gr', 10),
    (2, 'University of Crete', 'uoc@example.gr', 5),
    (3, 'Aristotle University of Thessaloniki', 'auth@example.gr', 0)
ON CONFLICT (id) DO NOTHING;

-- 📌 Credit Transactions
-- ΠΡΟΣΟΧΗ: όλες οι CONSUME είναι αρνητικές
INSERT INTO credits_service.credit_transaction (institution_id, amount, tx_type)
VALUES
    -- NTUA: αγοράζει και καταναλώνει
    (1, 10, 'PURCHASE'),
    (1, -1, 'CONSUME'),
    (1, -2, 'CONSUME'),

    -- UoC: αγοράζει
    (2, 5, 'PURCHASE'),

    -- AUTH: δεν έχει credits, δεν κάνει CONSUME

    -- Προσθέτουμε μια ακόμα κατανάλωση για demo
    (1, -3, 'CONSUME')
ON CONFLICT DO NOTHING;

-- 📌 Reset sequence counters (για SERIAL ids)
SELECT setval('credits_service.institution_id_seq', (SELECT MAX(id) FROM credits_service.institution));
SELECT setval('credits_service.credit_transaction_id_seq', (SELECT MAX(id) FROM credits_service.credit_transaction));
