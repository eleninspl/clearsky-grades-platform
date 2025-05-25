import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import StudentNavbar from './StudentNavbar';
import { useNavigate } from 'react-router-dom';
import useStudentGrades from '../../hooks/useStudentGrades';

function StudentDashboard() {
  const navigate = useNavigate();
  const { grades, loading, error } = useStudentGrades();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (grades.length > 0 && !selectedCourse) {
      setSelectedCourse(grades[0].course_title);
    }
  }, [grades]);

  return (
    <div className="student-dashboard-container">
      <StudentNavbar />
      <main className="student-dashboard-main">
        <div className="student-dashboard-table-section">
          <div className="student-dashboard-header">
            <h2 className="student-dashboard-title">My Course Grades</h2>
          </div>

          {loading && (
            <p className="student-dashboard-loading">Loading grades...</p>
          )}

          {error && (
            <p className="student-dashboard-error">{error}</p>
          )}

          {!loading && !error && grades.length === 0 && (
            <p className="student-dashboard-empty">No grades found for this student.</p>
          )}

          {!loading && !error && grades.length > 0 && (
            <table className="student-dashboard-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Grade Type</th>
                  <th>Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedCourse(g.course_title)}
                    className={
                      selectedCourse === g.course_title
                        ? 'student-dashboard-row-selected'
                        : ''
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{g.course_title}</td>
                    <td>{g.type}</td>
                    <td>{g.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="student-dashboard-charts-section">
          {selectedCourse &&
            ['total', 'Q1', 'Q2', 'Q3', 'Q4'].map((label, idx) => (
              <div
                key={label}
                className={
                  idx === 0
                    ? 'student-dashboard-chart-cell student-dashboard-chart-large'
                    : 'student-dashboard-chart-cell'
                }
              >
                <div className="student-dashboard-chart-title">
                  {selectedCourse} - {label}
                </div>
                <div className="student-dashboard-chart-placeholder">
                  [Chart Placeholder]
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
