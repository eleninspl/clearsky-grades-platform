import React, { useState, useEffect } from 'react';
import './StudentMyCourses.css';
import StudentNavbar from './StudentNavbar';
import { useReviewStatus } from '../../hooks/useReviewStatus';
import { fetchStudentGrades } from '../../api/grades';
import { createReviewRequest } from '../../api/reviews';
import { useStudentReviews } from '../../hooks/useStudentReviews';
import { useAuth } from '../../auth/AuthContext';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';
import SimpleBarChart from '../../components/SimpleBarChart';

function StudentMyCourses() {
  const { user } = useAuth();
  const { reviews: reviewRequests } = useStudentReviews(user?.id);

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
  const { statistics, loading: statsLoading, error: statsError } = useCourseStatistics(courseId);

  const handleSubmit = async (courseName) => {
    const gradeObj = grades.find(
      (g) => g.course_title === courseName && g.type === 'INITIAL'
    );

    if (!gradeObj) {
      alert('No INITIAL grade found for this course.');
      return;
    }

    try {
      await createReviewRequest({
        grade_id: gradeObj.grade_id,
        user_id: user.id,
        message: reviewComments[courseName] || '',
        course_id: gradeObj.course_id,
        course_title: gradeObj.course_title,
        student_name: user.full_name || 'Anonymous',
        instructor_id: gradeObj.instructor_id,
        exam_period: gradeObj.exam_period,
        grade_type: gradeObj.type,
        grade_value: gradeObj.grade,
        detailed_grade_json: gradeObj.detailed_grade_json || {},
      });

      alert('✅ Review request submitted successfully!');
      setActiveReviewCourse(null);
    } catch (err) {
      console.error('❌ Failed to submit review:', err);
      alert(`Σφάλμα: ${err.response?.data?.error || err.message}`);
    }
  };

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

                  let gradingStatus = 'N/A';
                  if (initial) gradingStatus = 'open';
                  else if (final) gradingStatus = 'closed';
                  const isClosed = gradingStatus === 'closed';


                  const hasInitialOpen = initial && initial.status === 'OPEN';

                  const hasReviewRequest = reviewRequests?.some(
                    r => r.course_id === course.course_id
                  );

                  const isAnswered = reviewRequests?.some(
                    r => r.course_id === course.course_id && r.status === 'ANSWERED'
                  );

                  return (
                    <tr key={course.course_id}>
                      <td>{courseTitle}</td>
                      <td>{examPeriod}</td>
                      <td>{gradingStatus}</td>
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
                          disabled={!hasInitialOpen || hasReviewRequest || isClosed}

                          onClick={() => {
                            setActiveReviewCourse(activeReviewCourse === courseTitle ? null : courseTitle);
                            setActiveGradeCourse(null);
                            setActiveStatusCourse(null);
                          }}
                        >
                          Ask for review
                        </button>

                        <button
                          disabled={!isAnswered}
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
                        <div className="chart-card">
                          <h5>Total</h5>
                          <SimpleBarChart
                            data={statistics.find((s) => s.label === 'total')?.data || []}
                            height={280}
                          />
                        </div>
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

            {activeStatusCourse && (() => {
              const courseIdForStatus = grades.find(c => c.course_title === activeStatusCourse)?.course_id || null;
              const { status, response, loading: statusLoading, error: statusError } = useReviewStatus(user?.id, courseIdForStatus);

              return (
                <div className="student-courses-status-wrapper">
                  <div className="student-courses-status-box">
                    <div className="student-courses-status-header">
                      REVIEW REQUEST STATUS – {activeStatusCourse}
                    </div>

                    {statusLoading && <p>Loading status...</p>}
                    {statusError && <p>Error: {statusError}</p>}

                    {!statusLoading && status && (
                      <>
                        <textarea
                          readOnly
                          value={
                            `Status: ${status}\n` +
                            (response
                              ? `Instructor Message: ${response.message}\nFinal Grade: ${response.final_grade}`
                              : 'No response yet.')
                          }
                          rows={6}
                        />
                        <div className="student-courses-status-buttons">
                          <button className="download-btn" disabled>
                            Download attachment
                          </button>
                          <button className="ack-btn" disabled>
                            Ack
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;