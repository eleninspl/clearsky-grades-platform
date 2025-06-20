-- 📌 Institution
INSERT INTO institution (id, name, email, credits_balance)
VALUES (1, 'Demo Institution', 'demo@demo.edu', 10);

-- 📌 ADMIN
INSERT INTO users (id, username, email, full_name, role)
VALUES (100, 'admin', 'admin@demo.edu', 'Admin User', 'ADMIN');

INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
VALUES (
  100,
  'LOCAL',
  'admin@demo.edu',
  '$2b$10$uuizdtZtIXX1XpzfGIwOmeaswCEsmW1U9cXhVFcT/T7T3V9DFIYCK'
);

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

DO $$
BEGIN
  PERFORM setval(
    pg_get_serial_sequence('users', 'id'),
    (SELECT MAX(id) FROM users)
  );
END
$$;


-- 📘 COURSES for instructor with id = 102
INSERT INTO course (id, code, title, exam_period, description, instructor_id, institution_id)
VALUES 
(101, 'CS101', 'Intro to Computer Science', 'Spring 2024', 'Introduction to computing, programming fundamentals, and problem-solving.', 102, 1),
(102, 'CS102', 'Data Structures', 'Spring 2024', 'Covers arrays, linked lists, stacks, queues, trees, graphs, and algorithm analysis.', 102, 1),
(103, 'CS103', 'Algorithms', 'Spring 2024', 'Covers sorting, searching, and algorithm design and analysis.', 102, 1),
(201, 'PHY101', 'Physics I', 'Fall 2024', 'Covers classical mechanics, motion, energy, and basic thermodynamics.', 102, 1),
(202, 'CS201', 'Software as a Service', 'Fall 2024', 'Focuses on software development lifecycle, agile methods, and system design.', 102, 1),
(203, 'MATH101', 'Mathematics I', 'Fall 2024', 'Introduction to linear algebra, calculus, and mathematical reasoning.', 102, 1),
(3205, 'CS3205', 'Software Engineering', 'Fall 2024', 'Auto-inserted course for upload test with ID 3205.', 102, 1)
ON CONFLICT DO NOTHING;