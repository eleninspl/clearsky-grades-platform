-- Εισαγωγή courses πρώτα
INSERT INTO courses.course (id, title, description, instructor_id)
VALUES
  (101, 'Math 101', 'Intro to Algebra', 1),
  (102, 'CS 102', 'Data Structures', 1),
  (103, 'History 103', 'Modern History', 2);

-- Έπειτα, εισαγωγή grade_batches που εξαρτώνται από τα παραπάνω
INSERT INTO courses.grade_batch (course_id, uploader_id, type)
VALUES 
  (101, 1, 'INITIAL'),
  (102, 1, 'FINAL'),
  (103, 2, 'INITIAL');

-- Τέλος, αν έχεις grade_batch_content
INSERT INTO courses.grade_batch_content (grade_batch_id, student_id, grade)
VALUES 
  (1, 103, 7.5),
  (2, 103, 9.0),
  (3, 103, 8.5);
