import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentMyCourses from '../pages/student/StudentMyCourses';


export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/dashboard" />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/courses" element={<StudentMyCourses />} />

    </Routes>
  );
}
