import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

export default function StudentDashboard({ setCurrentComponent }) {
  useEffect(() => {
    setCurrentComponent('CourseStatistics');
  }, [setCurrentComponent]);

  return (
    <div>
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main>
        <h1>Student Dashboard</h1>
      </main>
    </div>
  );
}
  