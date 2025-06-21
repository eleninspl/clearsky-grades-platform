-- 📌 Institution Snapshot
INSERT INTO institution_snapshot (id, name, email)
VALUES (1, 'Demo Institution', 'demo@demo.edu');

-- 📌 Users Snapshot
-- Instructors
INSERT INTO user_snapshot (id, full_name, role) VALUES
(102, 'Instructor User', 'INSTRUCTOR'),
(105, 'Instructor 2 User', 'INSTRUCTOR');

-- Student
INSERT INTO user_snapshot (id, full_name, role) VALUES
(103, 'Student User', 'STUDENT');

-- 📌 Courses Snapshot
INSERT INTO course_snapshot (id, title, code, instructor_id, exam_period) VALUES
(101, 'Intro to Computer Science', 'CS101', 102, 'Spring 2024'),
(102, 'Data Structures', 'CS102', 102, 'Spring 2024'),
(103, 'Algorithms', 'CS103', 102, 'Spring 2024'),
(3205, 'Software Engineering', 'CS3205', 102, 'Fall 2024'),
(3207, 'Artificial Intelligence', 'CS3207', 105, 'Fall 2024');

-- 📌 Review Request για βαθμό INITIAL στο μάθημα CS103
-- (grade_id = auto-synced από grades-service, π.χ. 9999 ή πραγματικό)
INSERT INTO review_request (
  grade_id,
  user_id,
  message,
  course_id,
  course_title,
  student_name,
  instructor_id,
  exam_period
) VALUES (
  9999,  -- πρέπει να ταιριάζει με το grade.id στο grades-service
  103,
  'Παρακαλώ επανεξέταση στην ερώτηση 2.',
  103,
  'Algorithms',
  'Student User',
  102,
  'Spring 2024'
);

-- 📌 Snapshot βαθμού του φοιτητή
INSERT INTO review_grade_snapshot (
  grade_id,
  type,
  value,
  detailed_grade_json,
  course_id,
  user_id
) VALUES (
  9999,
  'INITIAL',
  8.0,
  jsonb_build_object(
    'Q01', 9,
    'Q02', 8,
    'Q03', 9,
    'Q04', 9
  ),
  103,
  103
);

-- 🔁 Sync sequences
SELECT setval(pg_get_serial_sequence('review_request', 'id'), (SELECT MAX(id) FROM review_request));
SELECT setval(pg_get_serial_sequence('review_grade_snapshot', 'id'), (SELECT MAX(id) FROM review_grade_snapshot));
SELECT setval(pg_get_serial_sequence('review_response', 'id'), COALESCE((SELECT MAX(id) FROM review_response), 1));

-- ✅ Success message
DO $$ BEGIN RAISE NOTICE '✅ review-service seeded with compatible data'; END $$;
