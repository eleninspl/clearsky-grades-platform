import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

export default function InstructorDashboard({ setCurrentComponent }) {
  useEffect(() => {
    setCurrentComponent('CourseStatistics');
  }, [setCurrentComponent]);

  return (
    <div>
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main>
        <h1>Instructor Dashboard</h1>
      </main>
    </div>
  );
} 