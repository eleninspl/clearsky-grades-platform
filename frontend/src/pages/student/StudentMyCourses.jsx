import React, { useState } from 'react';
import './StudentMyCourses.css';
import StudentNavbar from './StudentNavbar';
import useStudentGrades from '../../hooks/useStudentGrades';

function StudentMyCourses() {
  const { grades, loading, error } = useStudentGrades();
  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [activeGradeCourse, setActiveGradeCourse] = useState(null);
  const [activeStatusCourse, setActiveStatusCourse] = useState(null);
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

        {loading && <p>Loading courses...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <table className="student-courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Grade Type</th>
                  <th>Final Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((course, index) => (
                  <tr key={index}>
                    <td>{course.course_title}</td>
                    <td>{course.type}</td>
                    <td>{course.grade}</td>
                    <td className="student-courses-actions">
                      <button
                        onClick={() => {
                          setActiveGradeCourse(activeGradeCourse === course.course_title ? null : course.course_title);
                          setActiveReviewCourse(null);
                          setActiveStatusCourse(null);
                        }}
                      >
                        View my grade
                      </button>
                      <button
                        disabled={course.type !== 'open'}
                        onClick={() => {
                          setActiveReviewCourse(activeReviewCourse === course.course_title ? null : course.course_title);
                          setActiveGradeCourse(null);
                          setActiveStatusCourse(null);
                        }}
                      >
                        Ask for review
                      </button>
                      <button
                        disabled={course.type !== 'closed'}
                        onClick={() => {
                          setActiveStatusCourse(activeStatusCourse === course.course_title ? null : course.course_title);
                          setActiveReviewCourse(null);
                          setActiveGradeCourse(null);
                        }}
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
                    New Review Request – <strong>{activeReviewCourse}</strong>
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

            {activeGradeCourse && (
              <div className="student-courses-grade-wrapper">
                <h3 className="student-courses-grade-title">
                  My Grades – {activeGradeCourse}
                </h3>
                <div className="student-courses-grade-grid">
                  <div className="student-courses-grade-box">
                    <h4>My Grades</h4>
                    <div className="student-courses-grade-labels">
                      <label>Total</label>
                      <input type="text" readOnly value={grades.find(c => c.course_title === activeGradeCourse)?.grade || ''} />
                      <label>Q1</label>
                      <input type="text" readOnly value="–" />
                      <label>Q2</label>
                      <input type="text" readOnly value="–" />
                      <label>Q3</label>
                      <input type="text" readOnly value="–" />
                    </div>
                  </div>
                  <div className="student-courses-grade-chartbox">
                    <h4>{activeGradeCourse} – Total</h4>
                    <div className="student-courses-grade-chart-placeholder">[Chart Placeholder]</div>
                  </div>
                </div>
              </div>
            )}

            {activeStatusCourse && (
              <div className="student-courses-status-wrapper">
                <div className="student-courses-status-box">
                  <div className="student-courses-status-header">
                    REVIEW REQUEST STATUS – {activeStatusCourse}
                  </div>
                  <textarea readOnly value="Status: Pending\n[This will be fetched from backend later]" />
                  <div className="student-courses-status-buttons">
                    <button className="download-btn">Download attachment</button>
                    <button className="ack-btn">Ack</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;
