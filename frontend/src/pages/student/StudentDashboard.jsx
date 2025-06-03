import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import StudentNavbar from './StudentNavbar';
import SimpleBarChart from '../../components/SimpleBarChart';
import { useNavigate } from 'react-router-dom';
import useStudentGrades from '../../hooks/useStudentGrades';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function StudentDashboard() {
  const navigate = useNavigate();
  const { grades, loading, error } = useStudentGrades();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    if (grades.length > 0 && !selectedCourseId) {
      setSelectedCourse(grades[0].course_title);
      setSelectedCourseId(grades[0].course_id);
    }
  }, [grades]);

  const {
    statistics,
    loading: statsLoading,
    error: statsError,
  } = useCourseStatistics(selectedCourseId);

  const totalStats = statistics.find((s) => s.label === 'total');
  const questionStats = statistics.filter((s) => s.label !== 'total');

  return (
    <div className="student-dashboard-container">
      <StudentNavbar />
      <main className="student-dashboard-main">
        <div className="student-dashboard-table-section">
          <div className="student-dashboard-header">
            <h2 className="student-dashboard-title">My Course Grades</h2>
          </div>

          {loading && <p className="student-dashboard-loading">Loading grades...</p>}
          {error && <p className="student-dashboard-error">{error}</p>}
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
                    onClick={() => {
                      setSelectedCourse(g.course_title);
                      setSelectedCourseId(g.course_id);
                    }}
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

        {/* 📊 Charts Section */}
        <div className="stats-charts-grid">
          {selectedCourseId && statsLoading && (
            <p className="student-dashboard-chart-loading">Loading statistics...</p>
          )}
          {selectedCourseId && statsError && (
            <p className="student-dashboard-chart-error">{statsError}</p>
          )}
          {selectedCourseId && !statsLoading && statistics.length > 0 && (
            <>
              {/* Total Chart */}
              {totalStats && (
                <div className="stats-chart-cell stats-chart-large">
                  <h3 className="stats-chart-title">{selectedCourse} – Total Distribution</h3>
                  <SimpleBarChart data={totalStats.data} height={300} />
                </div>
              )}

              {/* Per Question Charts */}
              {questionStats.length > 0 && (
                <div className="question-charts-group">
                  {questionStats.map((stat) => (
                    <div key={stat.label} className="stats-chart-cell">
                      <h4 className="stats-chart-title">
                        {selectedCourse} – {stat.label}
                      </h4>
                      <SimpleBarChart data={stat.data} height={160} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
