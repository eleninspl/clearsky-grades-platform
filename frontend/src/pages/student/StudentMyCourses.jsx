import React, { useState, useEffect } from 'react';
import './StudentMyCourses.css';
import StudentNavbar from './StudentNavbar';
import CourseTable from '../../components/CourseTable';
import GradeDetails from '../../components/GradeDetails';
import { useReviewStatus } from '../../hooks/useReviewStatus';
import { fetchStudentGrades } from '../../api/grades';
import { createReviewRequest } from '../../api/reviews';
import { useStudentReviews } from '../../hooks/useStudentReviews';
import { useAuth } from '../../auth/AuthContext';
import { useCourseStatistics } from '../../hooks/useCourseStatistics';

function StudentMyCourses() {
  const { user } = useAuth();
  const { reviews: reviewRequests, loading: loadingReviews, refetch: refetchReviews } = useStudentReviews(user?.id);

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeReviewCourse, setActiveReviewCourse] = useState(null);
  const [activeGradeCourse, setActiveGradeCourse] = useState(null);
  const [activeStatusCourse, setActiveStatusCourse] = useState(null);
  const [reviewComments, setReviewComments] = useState({});

  useEffect(() => {
    if (!user?.id) return;
    const loadGrades = async () => {
      try {
        const data = await fetchStudentGrades(user.id);
        setGrades(data);
      } catch (err) {
        setError(err.message || 'Error fetching grades');
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, [user]);

  const courseId = grades.find(c => c.course_title === activeGradeCourse)?.course_id || null;
  const courseGrades = grades.filter(c => c.course_title === activeGradeCourse);
  const gradeType = courseGrades.some(c => c.type === 'FINAL') ? 'FINAL' : 'INITIAL';
  const { statistics, loading: statsLoading, error: statsError } = useCourseStatistics(courseId, gradeType);

  const handleSubmit = async (courseName) => {
    const gradeObj = grades.find(
      (g) => g.course_title === courseName && g.type === 'INITIAL'
    );
    if (!gradeObj) return alert('No INITIAL grade found for this course.');
    if (reviewRequests?.some(r => r.grade_id === gradeObj.grade_id)) {
      return alert("You've already submitted a review request for this grade.");
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
      await refetchReviews();
      alert('✅ Review request submitted successfully!');
      setActiveReviewCourse(null);
    } catch (err) {
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

  // Κλήση του useReviewStatus εδώ, ΜΟΝΟ αν υπάρχει activeStatusCourse
  const courseForStatus = grades.find(c => c.course_id === activeStatusCourse);
  const {
    status,
    response,
    studentMessage,
    loading: statusLoading,
    error: statusError,
  } = useReviewStatus(user?.id, activeStatusCourse);

  return (
    <div className="student-courses-container">
      <StudentNavbar />
      <main className="student-courses-main">
        <h2 className="student-courses-title">My Courses</h2>

        {loading && <p>Loading courses...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <CourseTable
              groupedByCourse={groupedByCourse}
              activeGradeCourse={activeGradeCourse}
              activeReviewCourse={activeReviewCourse}
              activeStatusCourse={activeStatusCourse}
              setActiveGradeCourse={setActiveGradeCourse}
              setActiveReviewCourse={setActiveReviewCourse}
              setActiveStatusCourse={setActiveStatusCourse}
              reviewRequests={reviewRequests}
              loadingReviews={loadingReviews}
            />

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
              <GradeDetails
                grades={grades}
                activeGradeCourse={activeGradeCourse}
                statistics={statistics}
                statsLoading={statsLoading}
                statsError={statsError}
                gradeType={gradeType}
              />
            )}

            {activeStatusCourse && (
              <div className="student-review-status-box">
                <h4>Review Request Status – {courseForStatus?.course_title || 'Unknown Course'}</h4>
                {statusLoading ? (
                  <p>Loading...</p>
                ) : statusError ? (
                  <p style={{ color: 'red' }}>Error: {statusError}</p>
                ) : (
                  <textarea
                    readOnly
                    rows={6}
                    value={
                      `Status: ${status}\n` +
                      `Your message: ${studentMessage || '—'}\n` +
                      (response
                        ? `Instructor Message: ${response.message}`
                        : 'Instructor has not responded yet.')
                    }
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentMyCourses;
