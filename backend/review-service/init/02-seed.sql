-- Ένα demo review request
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
    999,
    103,
    'Παρακαλώ αναθεώρηση λόγω λανθασμένης βαθμολόγησης στο Q3.',
    103,
    'Algorithms',
    'Student User',
    102,
    'Spring 2024'
);

-- Μια απάντηση
INSERT INTO review_response (
    review_request_id,
    responder_id,
    message,
    final_grade
) VALUES (
    1,
    102,
    'Έγινε αποδεκτή η ένσταση. Ο βαθμός προσαρμόστηκε.',
    9.5
);
