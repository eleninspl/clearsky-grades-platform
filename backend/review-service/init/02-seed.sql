-- 📌 Institution Snapshot
INSERT INTO institution_snapshot (id, name, email)
VALUES (1, 'Demo Institution', 'demo@demo.edu');

-- 📌 Users Snapshot
-- Instructors
INSERT INTO user_snapshot (id, full_name, role) VALUES
(102, 'Instructor User', 'INSTRUCTOR');

-- Student
INSERT INTO user_snapshot (id, full_name, role) VALUES
(103, 'Student User', 'STUDENT');

-- 📌 Courses Snapshot
INSERT INTO course_snapshot (id, title, code, instructor_id, exam_period) VALUES
(103, 'Algorithms', 'CS103', 102, 'Spring 2024'),
(3205, 'Software Engineering', 'CS3205', 102, 'Fall 2024');


-- 🔁 Sync sequences
SELECT setval(pg_get_serial_sequence('review_request', 'id'), (SELECT MAX(id) FROM review_request));
SELECT setval(pg_get_serial_sequence('review_grade_snapshot', 'id'), (SELECT MAX(id) FROM review_grade_snapshot));
SELECT setval(pg_get_serial_sequence('review_response', 'id'), COALESCE((SELECT MAX(id) FROM review_response), 1));

-- ✅ Success message
DO $$ BEGIN RAISE NOTICE '✅ review-service seeded with compatible data'; END $$;
