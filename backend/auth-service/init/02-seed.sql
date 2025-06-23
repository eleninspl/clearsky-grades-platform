INSERT INTO institution (id, name, email, credits_balance)
VALUES (1, 'Demo Institution', 'demo@demo.edu', 10);

-- 📌 ADMIN
INSERT INTO users (id, username, email, full_name, role, google_email)
VALUES (100, 'admin', 'admin@demo.edu', 'Admin User', 'ADMIN', 'admin.clearsky@gmail.com');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  100,
  'LOCAL',
  'admin@demo.edu',
  '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK'
);

-- Add Google auth account for admin
INSERT INTO auth_account (user_id, provider, provider_uid)
VALUES (100, 'GOOGLE', 'admin.clearsky@gmail.com');

-- 📌 INST_REP
INSERT INTO users (id, username, email, full_name, role, institution_id, google_email)
VALUES (101, 'rep', 'rep@demo.edu', 'Institution Rep', 'INST_REP', 1, 'rep.clearsky@gmail.com');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  101,
  'LOCAL',
  'rep@demo.edu',
  '$2b$10$nwZ53d8vC4THi16VFILwpOl8gZD7cdK8mIWJg/oPF04EumPum1TxW'
);

-- Add Google auth account for rep
INSERT INTO auth_account (user_id, provider, provider_uid)
VALUES (101, 'GOOGLE', 'rep.clearsky@gmail.com');

-- 📌 INSTRUCTOR
INSERT INTO users (id, username, email, full_name, role, institution_id, google_email)
VALUES (102, 'instructor', 'instructor@demo.edu', 'Instructor User', 'INSTRUCTOR', 1, 'instructor.clearsky@gmail.com');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  102,
  'LOCAL',
  'instructor@demo.edu',
  '$2b$10$NwuB3yy/LRn9ooLT/W4wGOB6o.NwxS0eYvqQLxWoF0tMZyke.aWz6'
);

-- Add Google auth accounts for instructors
INSERT INTO auth_account (user_id, provider, provider_uid)
VALUES (102, 'GOOGLE', 'instructor.clearsky@gmail.com');

-- 📌 STUDENT (✅ με user_am = 103)
INSERT INTO users (id, username, email, full_name, role, institution_id, am)
VALUES (103, 'student', 'student@demo.edu', 'Student User', 'STUDENT', 1, 103);

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  103,
  'LOCAL',
  'student@demo.edu',
  '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
);


-- 📌 Steve's Personal Account
INSERT INTO users (id, username, email, full_name, role, institution_id, am, google_email)
VALUES (104, 'eleni', 'eleni@demo.edu', 'Eleni Nas', 'STUDENT', 1, 104, 'eleni.nspl@gmail.com');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  104,
  'LOCAL',
  'eleni@demo.edu',
  '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
);

-- 📌 Additional students with Google emails
DO $$
DECLARE
  i INT;
  google_emails TEXT[] := ARRAY[
    'student1.clearsky@gmail.com',
    'student2.clearsky@gmail.com', 
    'student3.clearsky@gmail.com',
    'student4.clearsky@gmail.com',
    'student5.clearsky@gmail.com',
    'student6.clearsky@gmail.com',
    'student7.clearsky@gmail.com',
    'student8.clearsky@gmail.com',
    'student9.clearsky@gmail.com',
    'student10.clearsky@gmail.com'
  ];
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO users (id, username, email, full_name, role, institution_id, am, google_email)
    VALUES (
      300 + i, -- id
      'student' || i,
      'student' || i || '@demo.edu',
      'Student ' || i,
      'STUDENT',
      1,
      400 + i,  -- am
      google_emails[i]
    )
    ON CONFLICT DO NOTHING;

    INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
    VALUES (
      300 + i,
      'LOCAL',
      'student' || i || '@demo.edu',
      '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
    )
    ON CONFLICT DO NOTHING;

    -- Add Google auth accounts for students
    INSERT INTO auth_account (user_id, provider, provider_uid)
    VALUES (
      300 + i,
      'GOOGLE', 
      google_emails[i]
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '👤 Created user % with AM % and Google email %', 300 + i, 400 + i, google_emails[i];
  END LOOP;
END $$;

DO $$
BEGIN
  PERFORM setval(
    pg_get_serial_sequence('users', 'id'),
    (SELECT MAX(id) FROM users)
  );
END
$$;