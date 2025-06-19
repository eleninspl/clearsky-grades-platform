INSERT INTO courses.course (code, title, description, exam_period, instructor_id, institution_id)
VALUES 
  ('CS101', 'Intro to Computer Science', 'Basics of CS', 'Spring 2024', 1, 1),
  ('MATH201', 'Linear Algebra', 'Matrices and vectors', 'Fall 2024', 2, 1),
  ('PHYS101', 'Physics I', 'Mechanics', 'Spring 2024', 3, 1);

INSERT INTO courses.grade_batch (course_id, uploader_id, type)
VALUES 
  (1, 1, 'INITIAL'),
  (1, 1, 'FINAL'),
  (2, 2, 'INITIAL');
