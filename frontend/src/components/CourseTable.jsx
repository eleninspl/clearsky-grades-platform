import React from 'react';

function CourseTable({
    groupedByCourse,
    activeGradeCourse,
    activeReviewCourse,
    activeStatusCourse,
    setActiveGradeCourse,
    setActiveReviewCourse,
    setActiveStatusCourse,
    reviewRequests,
    loadingReviews,
}) {
    return (
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
                    const gradingStatus = (course.review_state || 'void').toLowerCase();
                    const isSubmitted = initial && reviewRequests?.some(r => r.grade_id === initial.grade_id);
                    const hasReviewRequest = isSubmitted;

                    return (
                        <tr key={course.course_id}>
                            <td>{course.course_title}</td>
                            <td>{course.exam_period || '-'}</td>
                            <td>{gradingStatus}</td>
                            <td className="student-courses-actions">
                                <button
                                    onClick={() => {
                                        setActiveGradeCourse(
                                            activeGradeCourse === course.course_title ? null : course.course_title
                                        );
                                        setActiveReviewCourse(null);
                                        setActiveStatusCourse(null);
                                    }}
                                >
                                    View my grades
                                </button>

                                <button
                                    disabled={!initial || hasReviewRequest || loadingReviews || gradingStatus === 'closed'}
                                    title={
                                        loadingReviews
                                            ? 'Loading review request status...'
                                            : !initial
                                                ? 'You can only request a review if an INITIAL grade exists.'
                                                : hasReviewRequest
                                                    ? 'You have already submitted a review request for this grade.'
                                                    : gradingStatus === 'closed'
                                                        ? 'The grading for this course is finalized. You cannot request a review.'
                                                        : ''
                                    }
                                    onClick={() => {
                                        setActiveReviewCourse(
                                            activeReviewCourse === course.course_title ? null : course.course_title
                                        );
                                        setActiveGradeCourse(null);
                                        setActiveStatusCourse(null);
                                    }}
                                >
                                    Ask for review
                                </button>

                                <button
                                    disabled={!isSubmitted}
                                    onClick={() => {
                                        setActiveStatusCourse(
                                            activeStatusCourse === course.course_id ? null : course.course_id
                                        );
                                        setActiveGradeCourse(null);
                                        setActiveReviewCourse(null);
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
    );
}

export default CourseTable;
