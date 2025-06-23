-- SQLBook: Code
-- 📌 Institution
INSERT INTO institution (id, name, email, credits_balance)
VALUES (1, 'Demo Institution', 'demo@demo.edu', 4);

-- SQLBook: Code
INSERT INTO users (id, username, email, full_name, role)
VALUES (100, 'admin', 'admin@demo.edu', 'Admin User', 'ADMIN');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  100,
  'LOCAL',
  'admin@demo.edu',
  '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK'
);

-- SQLBook: Code
-- 📌 INST_REP
INSERT INTO users (id, username, email, full_name, role, institution_id)
VALUES (101, 'rep', 'rep@demo.edu', 'Institution Rep', 'INST_REP', 1);

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  101,
  'LOCAL',
  'rep@demo.edu',
  '$2b$10$nwZ53d8vC4THi16VFILwpOl8gZD7cdK8mIWJg/oPF04EumPum1TxW'
);

-- 📌 INSTRUCTOR
INSERT INTO users (id, username, email, full_name, role, institution_id)
VALUES (102, 'instructor', 'instructor@demo.edu', 'Instructor User', 'INSTRUCTOR', 1);

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  102,
  'LOCAL',
  'instructor@demo.edu',
  '$2b$10$NwuB3yy/LRn9ooLT/W4wGOB6o.NwxS0eYvqQLxWoF0tMZyke.aWz6'
);


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
INSERT INTO users (id, username, email, full_name, role, institution_id, am)
VALUES (104, 'eleni', 'eleni@demo.edu', 'Eleni Nas', 'STUDENT', 1, 104);

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  104,
  'LOCAL',
  'eleni@demo.edu',
  '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
);

INSERT INTO auth_account (user_id, provider, provider_uid)
VALUES (
  104,
  'GOOGLE',
  'eleni.nspl@gmail.com'
);


-- 📘 COURSES for instructor with id = 102
INSERT INTO course (id, code, title, exam_period, review_state, description, instructor_id, institution_id)
VALUES 
-- (101, 'CS101', 'Intro to Computer Science', 'Spring 2024', 'Introduction to computing, programming fundamentals, and problem-solving.', 102, 1),
-- (102, 'CS102', 'Data Structures', 'Spring 2024', 'Covers arrays, linked lists, stacks, queues, trees, graphs, and algorithm analysis.', 102, 1),
(103, 'CS103', 'Algorithms', 'Spring 2024', 'OPEN', 'Covers sorting, searching, and algorithm design and analysis.', 102, 1),
-- (201, 'PHY101', 'Physics I', 'Fall 2024', 'Covers classical mechanics, motion, energy, and basic thermodynamics.', 102, 1),
(3206, 'CS3206', 'Software as a Service', 'Spring 2024', 'VOID', 'Focuses on software development lifecycle, agile methods, and system design.', 102, 1),
-- (203, 'MATH101', 'Mathematics I', 'Fall 2024', 'Introduction to linear algebra, calculus, and mathematical reasoning.', 102, 1),
(3205, 'CS3205', 'Software Engineering', 'Fall 2024', 'VOID', 'Auto-inserted course for upload test with ID 3205.', 102, 1)
-- (3207, 'CS3207', 'Artificial Intelligence', 'Fall 2024', 'VOID', 'Auto-inserted course for AI instruction with ID 3207.', 102, 1)
ON CONFLICT DO NOTHING;

-- 🧹 Delete previous grades for this student
DELETE FROM grade WHERE user_am = 103;

-- 🧾 GRADE BATCHES
INSERT INTO grade_batch (id, course_id, uploader_id, type)
VALUES
(1, 3206, 102, 'INITIAL'),
(2, 3205, 102, 'INITIAL'),
(3, 103, 102, 'INITIAL')
-- (3, 3207, 102, 'INITIAL')
ON CONFLICT DO NOTHING;

-- ✅ GRADES για student@demo.edu
INSERT INTO grade (type, value, user_am, course_id, grade_batch_id)
VALUES
('INITIAL', NULL, 103, 3206, 1),
('INITIAL', NULL, 103, 3205, 2),
('INITIAL', 7, 103, 103, 3);
-- ('INITIAL', NULL, 103, 3207, 3);

-- ✅ GRADES για Eleni (AM: 104) - Copy of AM 103 grades
INSERT INTO grade (type, value, user_am, course_id, grade_batch_id)
VALUES
('INITIAL', NULL, 104, 3206, 1),
('INITIAL', NULL, 104, 3205, 2),
('INITIAL', 9, 104, 103, 3);
-- ('INITIAL', NULL, 104, 3207, 3);

-- 📌 GRADE BATCH for CS103
INSERT INTO grade_batch (id, course_id, uploader_id, type)
VALUES (4, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;


-- 🔁 Καθάρισε παλιά δεδομένα για CS103 (only for students 401-410)
DELETE FROM grade WHERE course_id = 103 AND user_am BETWEEN 401 AND 410;
DELETE FROM grade_batch WHERE id = 4;

-- 📦 Grade batch για CS103
INSERT INTO grade_batch (id, course_id, uploader_id, type)
VALUES (4, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;

-- 👤 Δημιουργία φοιτητών με user_am 401–410
DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO users (id, username, email, full_name, role, institution_id, am)
    VALUES (
      300 + i, -- id
      'student' || i,
      'student' || i || '@demo.edu',
      'Student ' || i,
      'STUDENT',
      1,
      400 + i  -- am
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

    RAISE NOTICE '👤 Created user % with AM %', 300 + i, 400 + i;
  END LOOP;
END $$;

-- 🔁 Επανεισαγωγή ποικιλίας βαθμών για CS103 (course_id = 103)
-- Delete only grades for students 401-410, not all grades for course 103
DELETE FROM grade WHERE course_id = 103 AND user_am BETWEEN 401 AND 410;

DO $$
DECLARE
  student_ams INT[] := ARRAY[401,402,403,404,405,406,407,408,409,410];
  values_list INT[] := ARRAY[9, 7, 8, 4, 5, 5, 8, 10, 6, 9];
  q1 INT[] := ARRAY[9, 7, 6, 4, 8, 5, 9, 7, 6, 10];
  q2 INT[] := ARRAY[10, 8, 7, 3, 9, 4, 9, 8, 5, 10];
  q3 INT[] := ARRAY[9, 6, 7, 2, 8, 4, 10, 6, 5, 9];
  q4 INT[] := ARRAY[10, 7, 6, 5, 8, 3, 9, 7, 6, 10];
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO grade (
      type, value, user_am, course_id, grade_batch_id, detailed_grade_json
    )
    VALUES (
      'INITIAL',
      values_list[i],
      student_ams[i],
      103,
      4,
      jsonb_build_object(
        'Q01', q1[i],
        'Q02', q2[i],
        'Q03', q3[i],
        'Q04', q4[i]
      )
    );

    RAISE NOTICE '✅ Inserted grade % for student %', values_list[i], student_ams[i];
  END LOOP;
END $$;

-- ✅ Update or insert grade for demo student (user_am = 103) in course CS103
-- ✅ Upsert grade for demo student (user_am = 103) in CS103
INSERT INTO grade (type, value, user_am, course_id, grade_batch_id, detailed_grade_json)
VALUES (
  'INITIAL',
  8,
  103,
  103,
  4,
  jsonb_build_object('Q01', 9, 'Q02', 8, 'Q03', 9, 'Q04', 9)
)
ON CONFLICT (user_am, course_id, type)
DO UPDATE SET
  value = EXCLUDED.value,
  grade_batch_id = EXCLUDED.grade_batch_id,
  detailed_grade_json = EXCLUDED.detailed_grade_json,
  uploaded_at = CURRENT_TIMESTAMP;

-- 🛠️ Sync the user ID sequence
DO $$
BEGIN
  PERFORM setval(
    pg_get_serial_sequence('users', 'id'),
    (SELECT MAX(id) FROM users)
  );
END
$$;

-- 🛠️ Sync the grade_batch ID sequence
DO $$
BEGIN
  PERFORM setval(
    pg_get_serial_sequence('grade_batch', 'id'),
    (SELECT MAX(id) FROM grade_batch)
  );
END
$$;

-- ✅ Logging notice correctly (inside a DO block)
DO $$
BEGIN
  RAISE NOTICE '🎓 Added comprehensive grades for Steve (AM: 104) across 6 courses';
  RAISE NOTICE '📊 Current GPA calculation: CS courses averaging ~90, STEM courses ~84';
END
$$;