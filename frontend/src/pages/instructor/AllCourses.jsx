import React, { useState, useEffect } from 'react';
import './AllCourses.css';
import Navbar from './InstNavbar.jsx';
import { fetchInstructorCourses } from '../../api/grades.js';
import { useAuth } from '../../auth/AuthContext';
import CourseCharts from '../../components/CourseCharts';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function AllCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [gradeType, setGradeType] = useState(null); // θα το καθορίζουμε δυναμικά

  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { statistics } = useCourseStatistics(selectedCourse?.id, gradeType);

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

  const handleCourseClick = (course) => {
    setSelectedCourse(course);

    // 👇 Επιλογή τύπου ανάλογα με το αν υπάρχει final_submission
    const hasFinal = course.final_submission && course.final_submission !== '-';
    setGradeType(hasFinal ? 'FINAL' : 'INITIAL');
  };

  const handleClosePopup = () => {
    setSelectedCourse(null);
    setGradeType(null);
  };

  return (
    <div className="courses-container">
      <Navbar />
      <main className="courses-main">
        <div className="courses-table-section">
          <div className="courses-header">
            <h2 className="courses-title">All My Courses</h2>
          </div>

          {loading && <p className="courses-loading">Loading courses...</p>}
          {error && <p className="courses-error">{error}</p>}
          {!loading && !error && courses.length === 0 && (
            <p className="courses-empty">No courses found.</p>
          )}

          {!loading && !error && courses.length > 0 && (
            <table className="courses-table">
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
                    onClick={() => handleCourseClick(course)}
                    style={{ cursor: 'pointer' }}
                    className="courses-table-row"
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

        {selectedCourse && (
          <div className="courses-popup-overlay" onClick={handleClosePopup}>
            <div className="courses-popup" onClick={(e) => e.stopPropagation()}>
              <div className="courses-popup-header">
                <h3>{selectedCourse.course_name}</h3>
                <button className="courses-popup-close" onClick={handleClosePopup}>
                  ×
                </button>
              </div>
              <div className="courses-popup-content">
                <div className="courses-popup-description">
                  <h4>Course Description</h4>
                  <p>{selectedCourse.description || 'No description available.'}</p>
                </div>
                <div className="courses-popup-charts">
                  <h4>Course Statistics ({gradeType})</h4>
                  <CourseCharts
                    courseName={selectedCourse?.course_name}
                    statistics={statistics}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AllCourses;
