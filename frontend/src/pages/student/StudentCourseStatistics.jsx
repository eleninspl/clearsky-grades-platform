import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentCourseStatistics.css';
import StudentNavbar from './StudentNavbar';


const myCourses = [
  {
    name: 'physics',
    period: 'spring 2025',
    grade: 8.5,
  },
  {
    name: 'software engineering',
    period: 'spring 2025',
    grade: 7.3,
  },
  {
    name: 'mathematics',
    period: 'spring 2025',
    grade: 9.0,
  },
];

const dummyCharts = {
  physics: ['total', 'Q1', 'Q2', 'Q3', 'Q4'],
  'software engineering': ['total', 'Q1', 'Q2', 'Q3', 'Q4'],
  mathematics: ['total', 'Q1', 'Q2', 'Q3', 'Q4'],
};

function StudentCourseStatistics() {
  const [selectedCourse, setSelectedCourse] = useState(myCourses[0].name);
  const navigate = useNavigate();
  return (
    <div className="student-stats-container">
      <StudentNavbar />
      <main className="student-stats-main">
        <div className="student-stats-table-section">
          <div className="student-stats-header">
            <h2 className="student-stats-title">My Course Grades</h2>
            <button
              className="student-stats-goto-btn"
              onClick={() => navigate('/student/courses')}
            >
              Go to my courses
            </button>
          </div>
          <table className="student-stats-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Exam Period</th>
                <th>Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map((course) => (
                <tr
                  key={course.name}
                  className={selectedCourse === course.name ? 'student-stats-row-selected' : ''}
                  onClick={() => setSelectedCourse(course.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{course.name}</td>
                  <td>{course.period}</td>
                  <td>{course.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="student-stats-charts-section">
          {dummyCharts[selectedCourse].map((label, idx) => (
            <div
              key={label}
              className={
                idx === 0
                  ? 'student-stats-chart-cell student-stats-chart-large'
                  : 'student-stats-chart-cell'
              }
            >
              <div className="student-stats-chart-title">{selectedCourse} - {label}</div>
              <div className="student-stats-chart-placeholder">[Chart Placeholder]</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StudentCourseStatistics;
