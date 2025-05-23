import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

import Login from '../auth/Login.jsx';
import InstructorRoutes from '../routes/InstructorRoutes';
import RepresentativeRoutes from '../routes/RepresentativeRoutes';
// import StudentRoutes from '../routes/StudentRoutes.jsx';

function ProtectedRoute({ roleRequired, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <div>Unauthorized</div>;
  }

  return children;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute roleRequired="INSTRUCTOR">
              <InstructorRoutes />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/student/*"
          element={
            <ProtectedRoute roleRequired="STUDENT">
              <StudentRoutes />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/representative/*"
          element={
            <ProtectedRoute roleRequired="INST_REP">
              <RepresentativeRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/instructor/statistics" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
