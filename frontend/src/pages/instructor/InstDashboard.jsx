import React, { useState, useEffect } from 'react';
import './InstDashboard.css';
import Navbar from './InstNavbar.jsx';
import SimpleBarChart from '../../components/SimpleBarChart';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function InstDashboard() {
  const { courses, loading, error } = useInstructorCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const { statistics, loading: statsLoading } = useCourseStatistics(selectedCourseId);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
      setSelectedCourseName(courses[0].course_name);
    }
  }, [courses]);

  const totalStats = statistics.find((s) => s.label === 'total');
  const questionStats = statistics.filter((s) => s.label !== 'total');

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
                    key={course.id}
                    className={selectedCourseId === course.id ? 'stats-row-selected' : ''}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedCourseName(course.course_name);
                    }}
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

        <div className="stats-charts-grid">
          <div className="stats-chart-cell stats-chart-large">
            <h3>{selectedCourseName} – Total Distribution</h3>
            <SimpleBarChart data={totalStats.data} />
          </div>

          <div className="question-charts-group">
            {questionStats.map((stat) => (
              <div key={stat.label} className="stats-chart-cell">
                <h4>{selectedCourseName} – {stat.label}</h4>
                <SimpleBarChart data={stat.data} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstDashboard;
