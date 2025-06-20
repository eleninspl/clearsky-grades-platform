import React, { useState, useEffect } from 'react';
import './InstDashboard.css';
import Navbar from './InstNavbar.jsx';
import CourseCharts from '../../components/CourseCharts.jsx';
import { fetchInstructorCourses } from '../../api/grades.js';
import { useAuth } from '../../auth/AuthContext';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function InstDashboard() {

  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchInstructorCourses(user.id);
        setCourses(data);
      } catch (err) {
        console.error('❌ Failed to load instructor courses:', err);
        setError('Could not load instructor courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?.id]);
 
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const { statistics, loading: statsLoading } = useCourseStatistics(selectedCourseId);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
      setSelectedCourseName(courses[0].course_name);
    }
  }, [courses]);

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
        {selectedCourseId && statistics.length > 0 && (
          <CourseCharts courseName={selectedCourseName} statistics={statistics} />
        )}
      </main>
    </div>
  );
}

export default InstDashboard;
