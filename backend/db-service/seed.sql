-- 📌 INSTITUTIONS
INSERT INTO clearsky.institution (id, name, email, credits_balance) VALUES
(1, 'National Technical University', 'contact@ntua.gr', 5),
-- (2, 'University of Crete', 'info@uoc.gr', 10);

-- -- 📌 USERS
-- INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
-- VALUES
-- (1, 'jdoe', 'jdoe@ntua.gr', 'John Doe', 'INSTRUCTOR', 1),
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
