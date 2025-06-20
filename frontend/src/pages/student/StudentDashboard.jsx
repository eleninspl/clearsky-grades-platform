import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import StudentNavbar from './StudentNavbar';
import CourseCharts from '../../components/CourseCharts';
import { fetchStudentGrades } from '../../api/grades';
import { useAuth } from '../../auth/AuthContext';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function StudentDashboard() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboard = async () => {
      try {
        const gradesData = await fetchStudentGrades(user.id);
        setGrades(gradesData);
      } catch (err) {
        console.error('❌ Failed to fetch dashboard:', err);
        setError(err.message || 'Error fetching dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  useEffect(() => {
    if (grades.length > 0 && !selectedCourseId) {
      setSelectedCourseId(grades[0].course_id);
    }
  }, [grades]);

  const selectedCourse = grades.find(g => g.course_id === selectedCourseId)?.course_title || '';

  const {
    statistics,
    loading: statsLoading,
    error: statsError,
  } = useCourseStatistics(selectedCourseId);

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
                    onClick={() => setSelectedCourseId(g.course_id)}
                    className={
                      selectedCourseId === g.course_id
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

        {selectedCourseId && !statsLoading && statistics.length > 0 && (
          <CourseCharts courseName={selectedCourse} statistics={statistics} />
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
