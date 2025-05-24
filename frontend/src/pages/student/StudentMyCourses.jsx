import React, { useState } from 'react';
import './StudentMyCourses.css';
import StudentNavbar from './StudentNavbar';

const myCourses = [
  {
    name: 'physics',
    period: 'spring 2025',
    grade: 8.5,
    gradingStatus: 'open',
    instructor: 'Dr. Nikos',
  },
  {
    name: 'software',
    period: 'fall 2024',
    grade: 7.3,
    gradingStatus: 'closed',
    instructor: 'Prof. Maria',
  },
  {
    name: 'mathematics',
    period: 'fall 2024',
    grade: 9.0,
    gradingStatus: 'closed',
    instructor: 'Dr. Kostas',
  },
];

function StudentMyCourses() {
  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [reviewComments, setReviewComments] = useState({});

  const handleSubmit = (courseName) => {
    alert(`Review submitted for ${courseName}:\n${reviewComments[courseName] || ''}`);
    setActiveReviewCourse(null);
  };

  return (
    <div className="student-courses-container">
      <StudentNavbar />
      <main className="student-courses-main">
        <h2 className="student-courses-title">My Courses</h2>
        <table className="student-courses-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Exam Period</th>
              <th>Final Grade</th>
              <th>Grading Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myCourses.map((course) => (
              <tr key={course.name}>
                <td>{course.name}</td>
                <td>{course.period}</td>
                <td>{course.grade}</td>
                <td>{course.gradingStatus}</td>
                <td className="student-courses-actions">
                  <button onClick={() => window.location.href = '/student/grades'}>View my grade</button>
                  <button
                    disabled={course.gradingStatus !== 'open'}
                    onClick={() =>
                      setActiveReviewCourse(
                        activeReviewCourse === course.name ? null : course.name
                      )
                    }
                  >
                    Ask for review
                  </button>
                  <button
                    disabled={course.gradingStatus !== 'closed'}
                    onClick={() => window.location.href = '/student/review-status'}
                  >
                    View review status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {activeReviewCourse && (
          <div className="student-courses-review-wrapper">
            <div className="student-courses-review-box">
              <div className="student-courses-review-title">
                New Review Request – <strong>{activeReviewCourse}</strong> (
                {myCourses.find(c => c.name === activeReviewCourse).period})
              </div>
              <div className="student-courses-review-instructor">
                Assigned to instructor:{' '}
                <strong>{myCourses.find(c => c.name === activeReviewCourse).instructor}</strong>
              </div>
              <textarea
                placeholder="Message to instructor"
                value={reviewComments[activeReviewCourse] || ''}
                onChange={(e) =>
                  setReviewComments({
                    ...reviewComments,
                    [activeReviewCourse]: e.target.value,
                  })
                }
                rows={4}
              />
              <button onClick={() => handleSubmit(activeReviewCourse)}>
                Submit grade review request
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;
