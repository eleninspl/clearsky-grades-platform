-- 📌 Institution (πρέπει να προηγείται)
INSERT INTO clearsky.institution (id, name, email, credits_balance)
VALUES (1, 'Demo Institution', 'demo@demo.edu', 10);

-- 📌 ADMIN
INSERT INTO clearsky.users (id, username, email, full_name, role)
VALUES (100, 'admin', 'admin@demo.edu', 'Admin User', 'ADMIN');

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  100,
  'LOCAL',
  'admin@demo.edu',
  '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK' -- adminpass
);

-- 📌 INST_REP
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
VALUES (101, 'rep', 'rep@demo.edu', 'Institution Rep', 'INST_REP', 1);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  101,
  'LOCAL',
  'rep@demo.edu',
  '$2b$10$nwZ53d8vC4THi16VFILwpOl8gZD7cdK8mIWJg/oPF04EumPum1TxW' -- reppass
);

-- 📌 INSTRUCTOR
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
VALUES (102, 'instructor', 'instructor@demo.edu', 'Instructor User', 'INSTRUCTOR', 1);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  102,
  'LOCAL',
  'instructor@demo.edu',
  '$2b$10$NwuB3yy/LRn9ooLT/W4wGOB6o.NwxS0eYvqQLxWoF0tMZyke.aWz6' -- instructorpass
);

-- 📌 STUDENT
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
VALUES (103, 'student', 'student@demo.edu', 'Student User', 'STUDENT', 1);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  103,
  'LOCAL',
  'student@demo.edu',
  '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC' -- studentpass
);

-- ✅ Debug για επιβεβαίωση
DO $$ BEGIN RAISE NOTICE '✅ Final seed.sql loaded'; END $$;


-- --  📌 USERS
--  INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
--  VALUES
--  (1, 'jdoe', 'jdoe@ntua.gr', 'John Doe', 'INSTRUCTOR', 1);

-- INSERT INTO clearsky.course (id, code, title, instructor_id, institution_id)
-- VALUES (
--   3205,                      -- course_id from Excel
--   'CS3205',                  -- your internal course code
--   'Τεχνολογία Λογισμικού',   -- title from your spreadsheet
--   1,                         -- instructor_id (placeholder, must exist in users)
--   1                          -- institution_id (placeholder, must exist in institution)
-- );




-- (2, 'maria', 'maria@uoc.gr', 'Maria Papadaki', 'STUDENT', 2),
-- (3, 'student1', 'student1@ntua.gr', 'Student One', 'STUDENT', 1);

-- -- 📌 AUTH ACCOUNTS
-- INSERT INTO clearsky.auth_account (user_id, provider, provider_uid)
-- VALUES
-- (1, 'GOOGLE', 'google-uid-1'),
-- (2, 'GOOGLE', 'google-uid-2'),
-- (3, 'LOCAL', 'student1');

-- -- 📌 COURSES
-- INSERT INTO clearsky.course (id, code, title, instructor_id, institution_id)
-- VALUES
-- (1, 'CS101', 'Intro to CS', 1, 1),
-- (2, 'CS102', 'Algorithms', 1, 1);

-- -- 📌 TEACHES (extra link)
-- INSERT INTO clearsky.teaches (user_id, course_id)
-- VALUES
-- (1, 1), (1, 2);

-- -- 📌 GRADE BATCHES
-- INSERT INTO clearsky.grade_batch (id, course_id, uploader_id, type)
-- VALUES
-- (1, 1, 1, 'INITIAL');

-- -- 📌 GRADES
-- INSERT INTO clearsky.grade (type, value, user_id, course_id, grade_batch_id)
-- VALUES
-- ('INITIAL', 85, 2, 1, 1),
-- ('INITIAL', 90, 3, 1, 1);

-- -- 📌 CREDIT CONSUMPTION (manually simulate what trigger does)
-- INSERT INTO clearsky.credit_transaction (institution_id, amount, tx_type, description, reference, created_by)
-- VALUES
-- (1, -1, 'CONSUME', 'Initial grades upload', '1_2025_INITIAL', 1);

-- -- 📌 REVIEW REQUEST
-- INSERT INTO clearsky.review_request (grade_id, message, user_id)
-- VALUES (1, 'Please review my grade', 2);

-- -- 📌 REVIEW RESPONSE
-- INSERT INTO clearsky.review_response (review_request_id, responder_id, message)
-- VALUES (1, 1, 'Reviewed and accepted.');

-- Resync ID sequence to avoid conflict with SERIAL inserts
-- SELECT setval('clearsky.users_id_seq', (SELECT MAX(id) FROM clearsky.users));


