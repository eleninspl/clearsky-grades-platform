import React, { useEffect } from 'react';
import StudentNavbar from './StudentNavbar.jsx';

export default function StudentDashboard({ setCurrentComponent }) {
  useEffect(() => {
    setCurrentComponent('StudentDashboard');
  }, [setCurrentComponent]);

  return (
    <div className="student-dashboard">
      <StudentNavbar setCurrentComponent={setCurrentComponent} />
      <main className="student-dashboard-main">
        <div className="container">
          <h1>Student Dashboard</h1>
          <div className="student-dashboard-content">
            <div className="card">
              <h2>My Courses</h2>
              <p>No courses enrolled yet.</p>
            </div>
            <div className="card">
              <h2>Recent Grades</h2>
              <p>No grades available yet.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
  