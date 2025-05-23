import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RepStatistics from '../representative/RepStatistics';
import RepCredits from '../representative/RepCredits';
import AddUser from '../representative/AddUser';
import RepresentativeDashboard from '../representative/Dashboard'; // Optional landing

export default function RepresentativeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/representative/statistics" />} />
      <Route path="/statistics" element={<RepStatistics />} />
      <Route path="/credits" element={<RepCredits />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/dashboard" element={<RepresentativeDashboard />} />
    </Routes>
  );
}
