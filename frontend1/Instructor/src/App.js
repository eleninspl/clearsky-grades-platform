import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import PostInitialGrades from './PostInitialGrades';
import PostFinalGrades from './PostFinalGrades';
import CourseStatistics from './CourseStatistics';
import Notifications from './Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/post-initial-grades" element={<PostInitialGrades />} />
        <Route path="/post-final-grades" element={<PostFinalGrades />} />
        <Route path="/course-statistics" element={<CourseStatistics />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App; 