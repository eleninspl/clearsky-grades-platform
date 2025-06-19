import React, { useState, useEffect } from 'react';
import './StudentMyCourses.css';
import StudentNavbar from './StudentNavbar';
//import { fetchGradesByStudentId } from '../../api/grades';
import { fetchStudentGrades } from '../../api/orchestrator';
import { submitReviewRequest } from '../../api/reviews';
import { useAuth } from '../../auth/AuthContext';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';
import SimpleBarChart from '../../components/SimpleBarChart';


function StudentMyCourses() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadGrades = async () => {
      try {
        const data = await fetchStudentGrades(user.id);
        setGrades(data);
      } catch (err) {
        console.error('❌ Failed to fetch grades:', err);
        setError(err.message || 'Error fetching grades');
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [user]);

  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [activeGradeCourse, setActiveGradeCourse] = useState(null);
  const [activeStatusCourse, setActiveStatusCourse] = useState(null);
  const [reviewComments, setReviewComments] = useState({});

  const courseId = grades.find(c => c.course_title === activeGradeCourse)?.course_id || null;
  const {
    statistics,
    loading: statsLoading,
    error: statsError,
  } = useCourseStatistics(courseId);

  const handleSubmit = async (courseName) => {
    const gradeObj = grades.find(
      (g) => g.course_title === courseName && g.type === 'INITIAL'
    );
  
    if (!gradeObj) {
      alert('No INITIAL grade found for this course.');
      return;
    }
  
    try {
      await submitReviewRequest({
        grade_id: gradeObj.grade_id, // ✅ από το backend
        user_id: user.id,            // ✅ από context
        message: reviewComments[courseName] || ''
      });
  
      alert('✅ Review request submitted successfully!');
      setActiveReviewCourse(null);
    } catch (err) {
      console.error('❌ Failed to submit review:', err);
      alert(`Σφάλμα: ${err.response?.data?.error || err.message}`);
    }
  };
  
    // Ομαδοποίηση βαθμών ανά μάθημα
    const groupedByCourse = grades.reduce((acc, grade) => {
      const key = grade.course_id;
      if (!acc[key]) acc[key] = { course: grade, initial: null, final: null };
      if (grade.type === 'INITIAL') acc[key].initial = grade;
      if (grade.type === 'FINAL') acc[key].final = grade;
      return acc;
    }, {});
    
  return (
    <div className="student-courses-container">
      <StudentNavbar />
      <main className="student-courses-main">
        <h2 className="student-courses-title">My Courses</h2>

        {loading && <p>Loading courses...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <table className="student-courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Exam Period</th>
                  <th>Grading Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {Object.values(groupedByCourse).map(({ course, initial, final }) => {
                const courseTitle = course.course_title;
                const examPeriod = course.exam_period;
                const gradingStatus = initial?.status || final?.status || 'VOID';

                const hasInitialOpen = initial && initial.status === 'OPEN';
                const hasReview = false; // TODO: Θα γίνει true αν υπάρχει review (θα το φτιάξουμε)
                
                return (
                  <tr key={course.course_id}>
                    <td>{courseTitle}</td>
                    <td>{examPeriod}</td>
                    <td>{gradingStatus.toLowerCase()}</td>
                    <td className="student-courses-actions">
                      <button
                        onClick={() => {
                          setActiveGradeCourse(activeGradeCourse === courseTitle ? null : courseTitle);
                          setActiveReviewCourse(null);
                          setActiveStatusCourse(null);
                        }}
                      >
                        View my grades
                      </button>

                      <button
                        disabled={!hasInitialOpen || hasReview}
                        onClick={() => {
                          setActiveReviewCourse(activeReviewCourse === courseTitle ? null : courseTitle);
                          setActiveGradeCourse(null);
                          setActiveStatusCourse(null);
                        }}
                      >
                        Ask for review
                      </button>

                      <button
                        disabled={!hasReview}
                        onClick={() => {
                          setActiveStatusCourse(activeStatusCourse === courseTitle ? null : courseTitle);
                          setActiveReviewCourse(null);
                          setActiveGradeCourse(null);
                        }}
                      >
                        View review status
                      </button>
                    </td>
                  </tr>
                );
              })}


              </tbody>
            </table>

            {activeReviewCourse && (
              <div className="student-courses-review-wrapper">
                <div className="student-courses-review-box">
                  <div className="student-courses-review-title">
                    New Review Request – <strong>{activeReviewCourse}</strong>
                  </div>
                  <textarea
                    placeholder="Message to instructor"
                    value={reviewComments[activeReviewCourse] || ''}
                    onChange={(e) =>
                      setReviewComments({
                        ...reviewComments,
                        [activeReviewCourse]: e.target.value,
                      })
                    }
                    rows={4}
                  />
                  <button onClick={() => handleSubmit(activeReviewCourse)}>
                    Submit grade review request
                  </button>
                </div>
              </div>
            )}

            {activeGradeCourse && (
              <div className="student-courses-grade-wrapper">
                <div className="student-courses-grade-grid">
                  <div className="student-courses-grade-box">
                    <h4>My Grades – {activeGradeCourse}</h4>
                    <div className="student-courses-grade-labels">
                      <label>Total</label>
                      <input type="text" readOnly value={grades.find(c => c.course_title === activeGradeCourse)?.grade || ''} />
                      {Object.entries(grades.find(c => c.course_title === activeGradeCourse)?.detailed_grade_json || {}).map(([key, val]) => (
                        <React.Fragment key={key}>
                          <label>{key.toUpperCase()}</label>
                          <input type="text" readOnly value={val} />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="student-courses-grade-chartbox">
                    <h4>{activeGradeCourse} – Statistics</h4>

                    {statsLoading && <p>Loading charts...</p>}
                    {statsError && <p>{statsError}</p>}

                    {!statsLoading && statistics?.length > 0 && (
                      <div className="student-courses-charts-scroll">
                        {/* Total Chart */}
                        <div className="chart-card">
                          <h5>Total</h5>
                          <SimpleBarChart
                            data={statistics.find((s) => s.label === 'total')?.data || []}
                            height={280}
                          />
                        </div>

                        {/* Per-Question Charts */}
                        {statistics
                          .filter((s) => s.label !== 'total')
                          .map((stat) => (
                            <div key={stat.label} className="chart-card">
                              <h5>{stat.label}</h5>
                              <SimpleBarChart data={stat.data} height={280} />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeStatusCourse && (
              <div className="student-courses-status-wrapper">
                <div className="student-courses-status-box">
                  <div className="student-courses-status-header">
                    REVIEW REQUEST STATUS – {activeStatusCourse}
                  </div>
                  <textarea readOnly value="Status: Pending\n[This will be fetched from backend later]" />
                  <div className="student-courses-status-buttons">
                    <button className="download-btn">Download attachment</button>
                    <button className="ack-btn">Ack</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;
