INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES 
  (100, 'LOCAL', 'admin@demo.edu', '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK'),
  (101, 'LOCAL', 'rep@demo.edu', '$2b$10$nwZ53d8vC4THi16VFILwpOl8gZD7cdK8mIWJg/oPF04EumPum1TxW'),
  (102, 'LOCAL', 'instructor@demo.edu', '$2b$10$NwuB3yy/LRn9ooLT/W4wGOB6o.NwxS0eYvqQLxWoF0tMZyke.aWz6'),
  (103, 'LOCAL', 'student@demo.edu', '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC');

DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
    VALUES (
      300 + i,
      'LOCAL',
      'student' || i || '@demo.edu',
      '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
