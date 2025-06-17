import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RepDashboard from '../pages/representative/RepDashboard';
import RepCredits from '../pages/representative/RepCredits';
import AddUser from '../pages/representative/AddUser';
import PurchaseCredits from '../pages/representative/PurchaseCredits';

export default function RepresentativeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/representative/dashboard" />} />
      <Route path="/dashboard" element={<RepDashboard />} />
      <Route path="/credits" element={<RepCredits />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/representative/purchase-credits" element={<PurchaseCredits />} />
    </Routes>
  );
}
