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

const reviewStatusData = {
  physics: {
    status: 'Pending',
    instructor: 'Dr. Nikos',
    comment: '',
  },
  software: {
    status: 'Accepted',
    instructor: 'Prof. Maria',
    comment: 'You were right. I updated the grade.',
  },
  mathematics: {
    status: 'Rejected',
    instructor: 'Dr. Kostas',
    comment: 'Grade remains as originally given.',
  }
};

function StudentMyCourses() {
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
                  <button
                    onClick={() => {
                      setActiveGradeCourse(activeGradeCourse === course.name ? null : course.name);
                      setActiveReviewCourse(null);
                      setActiveStatusCourse(null);
                    }}
                  >
                    View my grade
                  </button>
                  <button
                    disabled={course.gradingStatus !== 'open'}
                    onClick={() => {
                      setActiveReviewCourse(activeReviewCourse === course.name ? null : course.name);
                      setActiveGradeCourse(null);
                      setActiveStatusCourse(null);
                    }}
                  >
                    Ask for review
                  </button>
                  <button
                    disabled={course.gradingStatus !== 'closed'}
                    onClick={() => {
                      setActiveStatusCourse(activeStatusCourse === course.name ? null : course.name);
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

        {activeGradeCourse && (
          <div className="student-courses-grade-wrapper">
            <h3 className="student-courses-grade-title">
              My Grades – {activeGradeCourse} ({myCourses.find(c => c.name === activeGradeCourse).period})
            </h3>
            <div className="student-courses-grade-grid">
              <div className="student-courses-grade-box">
                <h4>My Grades</h4>
                <div className="student-courses-grade-labels">
                  <label>Total</label>
                  <input type="text" readOnly value={myCourses.find(c => c.name === activeGradeCourse).grade} />
                  <label>Q1</label>
                  <input type="text" readOnly value="8.2" />
                  <label>Q2</label>
                  <input type="text" readOnly value="9.0" />
                  <label>Q3</label>
                  <input type="text" readOnly value="7.8" />
                </div>
              </div>
              <div className="student-courses-grade-chartbox">
                <h4>{activeGradeCourse} – Total</h4>
                <div className="student-courses-grade-chart-placeholder">[Total Chart Placeholder]</div>
              </div>
              <div className="student-courses-grade-chartbox">
                <h4>{activeGradeCourse} – Q1</h4>
                <div className="student-courses-grade-chart-placeholder">[Q1 Chart Placeholder]</div>
              </div>
              <div className="student-courses-grade-chartbox">
                <h4>...</h4>
                <div className="student-courses-grade-chart-placeholder">[More Charts]</div>
              </div>
            </div>
          </div>
        )}

        {activeStatusCourse && (
          <div className="student-courses-status-wrapper">
            <div className="student-courses-status-box">
              <div className="student-courses-status-header">
                REVIEW REQUEST STATUS – {activeStatusCourse} ({myCourses.find(c => c.name === activeStatusCourse).period})
              </div>

              <div className="student-courses-status-field">
                <label>Message FROM instructor</label>
                <textarea
                  readOnly
                  value={reviewStatusData[activeStatusCourse].comment || '—'}
                />
              </div>

              <div className="student-courses-status-buttons">
                <button className="download-btn">Download attachment</button>
                <button className="ack-btn">Ack</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;
