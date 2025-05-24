import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import StudentCourseStatistics from '../pages/student/StudentCourseStatistics';
import StudentMyCourses from '../pages/student/StudentMyCourses';
import StudentReviewStatus from '../pages/student/StudentReviewStatus';
import StudentViewGrades from '../pages/student/StudentViewGrades';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/statistics" />} />
      <Route path="/statistics" element={<StudentCourseStatistics />} />
      <Route path="/courses" element={<StudentMyCourses />} />
      <Route path="/review-status" element={<StudentReviewStatus />} />
      <Route path="/grades" element={<StudentViewGrades />} />
    </Routes>
  );
}
