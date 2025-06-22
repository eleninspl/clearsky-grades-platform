-- 📌 Institutions
INSERT INTO credits_service.institution (id, name, email, credits_balance)
VALUES
    (1, 'National Technical University of Athens', 'ntua@example.gr', 0),
    (2, 'University of Crete', 'uoc@example.gr', 5),
    (3, 'Aristotle University of Thessaloniki', 'auth@example.gr', 0)
ON CONFLICT (id) DO NOTHING;


-- 📌 Reset sequence counters (για SERIAL ids)
SELECT setval('credits_service.institution_id_seq', (SELECT MAX(id) FROM credits_service.institution));
SELECT setval('credits_service.credit_transaction_id_seq', (SELECT MAX(id) FROM credits_service.credit_transaction));
