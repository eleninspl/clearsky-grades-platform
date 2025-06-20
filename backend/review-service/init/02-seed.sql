-- ✅ Dummy test user/instructor/grade that real users δεν θα χρησιμοποιήσουν
-- Χρησιμοποιούμε IDs στη “ζώνη 9000+” για να αποφύγουμε συγκρούσεις

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
  9999,
  9001,
  'Demo request for testing only.',
  9001,
  'Test Course',
  'Test Student',
  102,
  'Fall 2099'
);

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
  4.0,
  '{"Q01": 5, "Q02": 4, "Q03": 3, "Q04": 4}',
  9001,
  9001
);

-- Δεν εισάγουμε response, για να μπορεί να τεσταριστεί η απάντηση instructor αν θέλει

-- Sync sequences
SELECT setval(pg_get_serial_sequence('review_request', 'id'), MAX(id));
SELECT setval(pg_get_serial_sequence('review_grade_snapshot', 'id'), MAX(id));
SELECT setval(pg_get_serial_sequence('review_response', 'id'), COALESCE((SELECT MAX(id) FROM review_response), 1));
