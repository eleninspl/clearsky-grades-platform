import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CourseStatistics from '../pages/instructor/CourseStatistics';
import AllCourses from '../pages/instructor/AllCourses';
import Notifications from '../pages/instructor/Notifications';
import PostInitialGrades from '../pages/instructor/PostInitialGrades';
import PostFinalGrades from '../pages/instructor/PostFinalGrades';

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/instructor/statistics" />} />
      <Route path="/statistics" element={<CourseStatistics />} />
      <Route path="/courses" element={<AllCourses />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/grades/initial" element={<PostInitialGrades />} />
      <Route path="/grades/final" element={<PostFinalGrades />} />
    </Routes>
  );
}
