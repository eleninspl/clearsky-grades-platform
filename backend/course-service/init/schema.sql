-- Courses
INSERT INTO clearsky.course (id, code, title, instructor_id, institution_id, exam_period, description)
VALUES 
  (101, 'CS101', 'Introduction to Computer Science', 102, 1, '2025-June', 'Basics of CS'),
  (102, 'CS102', 'Data Structures', 102, 1, '2025-June', 'Linked lists, trees'),
  (103, 'CS103', 'Databases', 102, 1, '2025-June', 'Relational DBs and SQL');

-- Grade Batches
INSERT INTO clearsky.grade_batch (id, course_id, uploader_id, type)
VALUES 
  (1, 101, 102, 'INITIAL'),
  (2, 102, 102, 'INITIAL'),
  (3, 103, 102, 'INITIAL');

-- Grades
INSERT INTO clearsky.grade (course_id, user_id, grade_batch_id, value, status, detailed_grade_json)
VALUES 
  (101, 103, 1, 86, 'APPROVED', '{}'),
  (102, 103, 2, 92, 'APPROVED', '{}'),
  (103, 103, 3, 90, 'APPROVED', '{}');
