-- 📌 Institution
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
  '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK'
);

-- 📌 INST_REP
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
VALUES (101, 'rep', 'rep@demo.edu', 'Institution Rep', 'INST_REP', 1);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  101,
  'LOCAL',
  'rep@demo.edu',
  '$2b$10$nwZ53d8vC4THi16VFILwpOl8gZD7cdK8mIWJg/oPF04EumPum1TxW'
);

-- 📌 INSTRUCTOR
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
VALUES (102, 'instructor', 'instructor@demo.edu', 'Instructor User', 'INSTRUCTOR', 1);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  102,
  'LOCAL',
  'instructor@demo.edu',
  '$2b$10$NwuB3yy/LRn9ooLT/W4wGOB6o.NwxS0eYvqQLxWoF0tMZyke.aWz6'
);

-- 📌 STUDENT (✅ με user_am = 103)
INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id, am)
VALUES (103, 'student', 'student@demo.edu', 'Student User', 'STUDENT', 1, 103);

INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  103,
  'LOCAL',
  'student@demo.edu',
  '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC'
);

-- 📘 COURSES for instructor with id = 102
INSERT INTO clearsky.course (id, code, title, exam_period, description, instructor_id, institution_id)
VALUES 
(101, 'CS101', 'Intro to Computer Science', 'Spring 2024', 'Introduction to computing, programming fundamentals, and problem-solving.', 102, 1),
(102, 'CS102', 'Data Structures', 'Spring 2024', 'Covers arrays, linked lists, stacks, queues, trees, graphs, and algorithm analysis.', 102, 1),
(103, 'CS103', 'Algorithms', 'Spring 2024', 'Covers sorting, searching, and algorithm design and analysis.', 102, 1),
(201, 'PHY101', 'Physics I', 'Fall 2024', 'Covers classical mechanics, motion, energy, and basic thermodynamics.', 102, 1),
(202, 'CS201', 'Software Engineering', 'Fall 2024', 'Focuses on software development lifecycle, agile methods, and system design.', 102, 1),
(203, 'MATH101', 'Mathematics I', 'Fall 2024', 'Introduction to linear algebra, calculus, and mathematical reasoning.', 102, 1)

ON CONFLICT DO NOTHING;



-- 💳 CREDIT TRANSACTIONS DUMMY
INSERT INTO clearsky.credit_transaction (institution_id, amount, tx_type, description, reference, created_by, created_at)
VALUES 
(1, 1000, 'PURCHASE', 'Initial funding', 'manual_batch_1', 101, NOW() - INTERVAL '30 days'),
(1, 2000, 'PURCHASE', 'Top-up for semester', 'manual_batch_2', 101, NOW() - INTERVAL '20 days'),
(1, 1500, 'PURCHASE', 'Additional credits', 'manual_batch_3', 101, NOW() - INTERVAL '10 days'),
(1, -1, 'CONSUME', 'Grade upload CS101', '101_2025_INITIAL', 102, NOW() - INTERVAL '18 days'),
(1, -1, 'CONSUME', 'Grade upload CS102', '102_2025_INITIAL', 102, NOW() - INTERVAL '15 days');

-- 🧹 Delete previous grades for this student
DELETE FROM clearsky.grade WHERE user_am = 103;

-- 🧾 GRADE BATCHES
INSERT INTO clearsky.grade_batch (id, course_id, uploader_id, type)
VALUES
(1, 101, 102, 'INITIAL'),
(2, 102, 102, 'INITIAL'),
(3, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;

-- ✅ GRADES για student@demo.edu
INSERT INTO clearsky.grade (type, value, user_am, course_id, grade_batch_id, status)
VALUES
('INITIAL', 86, 103, 101, 1, 'OPEN'),
('INITIAL', 92, 103, 102, 2, 'VOID'),
('INITIAL', 90, 103, 103, 3, 'OPEN');

-- 📌 GRADE BATCH for CS103
INSERT INTO clearsky.grade_batch (id, course_id, uploader_id, type)
VALUES (4, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;


-- 🔁 Καθάρισε παλιά δεδομένα για CS103
DELETE FROM clearsky.grade WHERE course_id = 103;
DELETE FROM clearsky.grade_batch WHERE id = 4;

-- 📦 Grade batch για CS103
INSERT INTO clearsky.grade_batch (id, course_id, uploader_id, type)
VALUES (4, 103, 102, 'INITIAL')
ON CONFLICT DO NOTHING;

-- 👤 Δημιουργία φοιτητών με user_am 401–410
DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id, am)
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

    INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
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
DELETE FROM clearsky.grade WHERE course_id = 103;

DO $$
DECLARE
  student_ams INT[] := ARRAY[401,402,403,404,405,406,407,408,409,410];
  values_list INT[] := ARRAY[91, 75, 68, 45, 80, 55, 88, 72, 60, 95];
  q1 INT[] := ARRAY[9, 7, 6, 4, 8, 5, 9, 7, 6, 10];
  q2 INT[] := ARRAY[10, 8, 7, 3, 9, 4, 9, 8, 5, 10];
  q3 INT[] := ARRAY[9, 6, 7, 2, 8, 4, 10, 6, 5, 9];
  q4 INT[] := ARRAY[10, 7, 6, 5, 8, 3, 9, 7, 6, 10];
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO clearsky.grade (
      type, value, user_am, course_id, grade_batch_id, status, detailed_grade_json
    )
    VALUES (
      'INITIAL',
      values_list[i],
      student_ams[i],
      103,
      4,
      'OPEN',
      jsonb_build_object(
        'Q1', q1[i],
        'Q2', q2[i],
        'Q3', q3[i],
        'Q4', q4[i]
      )
    );

    RAISE NOTICE '✅ Inserted grade % for student %', values_list[i], student_ams[i];
  END LOOP;
END $$;

-- ➕ Προσθήκη βαθμού για τον demo φοιτητή (user_am = 103) στο μάθημα CS103 (course_id = 103)
INSERT INTO clearsky.grade (type, value, user_am, course_id, grade_batch_id, status, detailed_grade_json)
VALUES (
  'INITIAL',
  85,  -- Μπορείς να αλλάξεις την τιμή του βαθμού όπως θες
  103,
  103,
  4,
  'OPEN',
  jsonb_build_object(
    'Q1', 9,
    'Q2', 8,
    'Q3', 9,
    'Q4', 9
  )
);


