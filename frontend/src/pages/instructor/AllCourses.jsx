import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllCourses.css';
import Navbar from './InstNavbar.jsx';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import SimpleBarChart from '../../components/SimpleBarChart';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';


function AllCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const { statistics } = useCourseStatistics(selectedCourse?.id);
  const totalStats = statistics?.find((s) => s.label === 'total');
  const questionStats = statistics?.filter((s) => s.label !== 'total');

  const navigate = useNavigate();

  const { courses, loading, error } = useInstructorCourses();

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleClosePopup = () => {
    setSelectedCourse(null);
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
                <button className="courses-popup-close" onClick={handleClosePopup}>×</button>
              </div>
              <div className="courses-popup-content">
                <div className="courses-popup-description">
                  <h4>Course Description</h4>
                  <p>{selectedCourse.description || 'No description available.'}</p>
                </div>
                <div className="courses-popup-charts">
                  <h4>Course Statistics</h4>
                  <div className="courses-charts-grid">
                    <div className="courses-chart-cell courses-chart-large">
                      <div className="courses-chart-title">{selectedCourse.course_name} – Total</div>
                      <SimpleBarChart data={totalStats?.data || []} />
                    </div>

                    <div className="question-charts-group">
                      {questionStats.map((stat) => (
                        <div className="courses-chart-cell" key={stat.label}>
                          <div className="courses-chart-title">{selectedCourse.course_name} – {stat.label}</div>
                          <SimpleBarChart data={stat.data} />
                        </div>
                      ))}
                    </div>
                  </div>

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
