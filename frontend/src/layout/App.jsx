import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

import Login from '../auth/Login.jsx';
import GoogleSuccess from '../auth/GoogleSuccess.jsx';
import InstructorRoutes from '../routes/InstructorRoutes';
import RepresentativeRoutes from '../routes/RepresentativeRoutes';
import StudentRoutes from '../routes/StudentRoutes.jsx';
import RoleRedirect from '../routes/RoleRedirect';


function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
              <InstructorRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/representative/*"
          element={
            <ProtectedRoute allowedRoles={['INST_REP']}>
              <RepresentativeRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="/redirect" element={<RoleRedirect />} />
        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;
