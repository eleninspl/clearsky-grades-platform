import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import InstDashboard from '../pages/instructor/InstDashboard';
import AllCourses from '../pages/instructor/AllCourses';
import Notifications from '../pages/instructor/Notifications';
import PostInitialGrades from '../pages/instructor/PostInitialGrades';
import PostFinalGrades from '../pages/instructor/PostFinalGrades';

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/instructor/dashboard" />} />
      <Route path="/dashboard" element={<InstDashboard />} />
      <Route path="/courses" element={<AllCourses />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/grades/initial" element={<PostInitialGrades />} />
      <Route path="/grades/final" element={<PostFinalGrades />} />
    </Routes>
  );
}
