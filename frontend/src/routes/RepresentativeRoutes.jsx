import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RepStatistics from '../pages/representative/RepStatistics';
import RepCredits from '../pages/representative/RepCredits';
import AddUser from '../pages/representative/AddUser';

export default function RepresentativeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/representative/statistics" />} />
      <Route path="/statistics" element={<RepStatistics />} />
      <Route path="/credits" element={<RepCredits />} />
      <Route path="/add-user" element={<AddUser />} />
    </Routes>
  );
}
