import React from 'react';
import './StudentReviewStatus.css';
import StudentNavbar from './StudentNavbar';

const reviewRequests = [
  {
    course: 'physics',
    period: 'spring 2025',
    instructor: 'Dr. Nikos',
    status: 'Pending',
    instructorComment: ''
  },
  {
    course: 'software',
    period: 'fall 2024',
    instructor: 'Prof. Maria',
    status: 'Accepted',
    instructorComment: 'You were right. I updated the grade accordingly.'
  },
  {
    course: 'mathematics',
    period: 'fall 2024',
    instructor: 'Dr. Kostas',
    status: 'Rejected',
    instructorComment: 'After review, the original grade remains valid.'
  }
];

function StudentReviewStatus() {
  return (
    <div className="student-status-container">
      <StudentNavbar />
      <main className="student-status-main">
        <h2 className="student-status-title">My Review Requests</h2>

        <table className="student-status-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Period</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Instructor Comment</th>
            </tr>
          </thead>
          <tbody>
            {reviewRequests.map((req, idx) => (
              <tr key={idx}>
                <td>{req.course}</td>
                <td>{req.period}</td>
                <td>{req.instructor}</td>
                <td>{req.status}</td>
                <td>{req.instructorComment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default StudentReviewStatus;
