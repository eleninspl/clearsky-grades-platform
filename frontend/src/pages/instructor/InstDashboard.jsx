import React, { useState, useEffect } from 'react';
import './InstDashboard.css';
import Navbar from './InstNavbar.jsx';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';

function InstDashboard() {
  const { courses, loading, error } = useInstructorCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].course_name);
    }
  }, [courses]);

  // Dummy charts generator based on course name
  const dummyCharts = Object.fromEntries(
    courses.map(course => [
      course.course_name,
      ['total', 'Q1', 'Q2', 'Q3', 'Q4'].map(label => ({
        title: `${course.course_name} - ${course.exam_period || 'N/A'} - ${label}`,
      }))
    ])
  );

  return (
    <div className="stats-container">
      <Navbar />
      <main className="stats-main">
        <div className="stats-table-section">
          <div className="stats-header">
            <h2 className="stats-title">Available Course Statistics</h2>
          </div>

          {loading && <p className="stats-loading">Loading courses...</p>}
          {error && <p className="stats-error">{error}</p>}

          {!loading && !error && courses.length === 0 && (
            <p className="stats-empty">No courses found for this instructor.</p>
          )}

          {!loading && !error && courses.length > 0 && (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Exam Period</th>
                  <th>Initial Grades Submission</th>
                  <th>Final Grades Submission</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.course_name}
                    className={
                      selectedCourse === course.course_name ? 'stats-row-selected' : ''
                    }
                    onClick={() => setSelectedCourse(course.course_name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{course.course_name}</td>
                    <td>{course.exam_period || '-'}</td>
                    <td>{course.initial_submission || '-'}</td>
                    <td>{course.final_submission || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="stats-charts-section">
          {selectedCourse &&
            (dummyCharts[selectedCourse] || []).map((chart, idx) => (
              <div
                key={chart.title}
                className={
                  idx === 0
                    ? 'stats-chart-cell stats-chart-large'
                    : 'stats-chart-cell'
                }
              >
                <div className="stats-chart-title">{chart.title}</div>
                <div className="stats-chart-placeholder">[Chart Placeholder]</div>
              </div>
            ))}
          <div className="stats-chart-cell stats-chart-ellipsis">
            <div className="stats-chart-placeholder">...</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstDashboard;
