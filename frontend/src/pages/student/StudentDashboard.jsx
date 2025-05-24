import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
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

function StudentDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(myCourses[0].name);
  const navigate = useNavigate();
  return (
    <div className="student-dashboard-container">
      <StudentNavbar />
      <main className="student-dashboard-main">
        <div className="student-dashboard-table-section">
          <div className="student-dashboard-header">
            <h2 className="student-dashboard-title">My Course Grades</h2>
            {/* <button
              className="student-stats-goto-btn"
              onClick={() => navigate('/student/courses')}
            >
              Go to my courses
            </button> */}
          </div>
          <table className="student-dashboard-table">
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
                  className={selectedCourse === course.name ? 'student-dashboard-row-selected' : ''}
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

        <div className="student-dashboard-charts-section">
          {dummyCharts[selectedCourse].map((label, idx) => (
            <div
              key={label}
              className={
                idx === 0
                  ? 'student-dashboard-chart-cell student-dashboard-chart-large'
                  : 'student-dashboard-chart-cell'
              }
            >
              <div className="student-dashboard-chart-title">{selectedCourse} - {label}</div>
              <div className="student-dashboard-chart-placeholder">[Chart Placeholder]</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
