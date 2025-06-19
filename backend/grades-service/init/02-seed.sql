-- Grade Batches
INSERT INTO grade_batch (id, course_id, uploader_id, type)
VALUES 
  (1, 101, 102, 'INITIAL'),
  (2, 102, 102, 'INITIAL'),
  (3, 103, 102, 'INITIAL');

-- Grades for student@demo.edu
INSERT INTO grade (type, value, user_am, course_id, grade_batch_id, status)
VALUES 
  ('INITIAL', 86, 103, 101, 1, 'OPEN'),
  ('INITIAL', 92, 103, 102, 2, 'VOID'),
  ('INITIAL', 90, 103, 103, 3, 'OPEN');

-- Επιπλέον batch
INSERT INTO grade_batch (id, course_id, uploader_id, type)
VALUES (4, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;

-- Μαζικοί φοιτητές και βαθμοί
DO $$
DECLARE
  student_ams INT[] := ARRAY[401,402,403,404,405,406,407,408,409,410];
  i INT;
BEGIN
  FOR i IN 1..array_length(student_ams, 1) LOOP
    INSERT INTO grade (
      type, value, user_am, course_id, grade_batch_id, status, detailed_grade_json
    )
    VALUES (
      'INITIAL',
      70 + (i % 10),
      student_ams[i],
      103,
      4,
      'OPEN',
      '{}'
    );
  END LOOP;
END $$;
