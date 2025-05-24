import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  console.log('User in RoleRedirect:', user);


  switch (user.role) {
    case 'INST_REP':
      return <Navigate to="/representative/statistics" replace />;
    case 'INSTRUCTOR':
      return <Navigate to="/instructor/statistics" replace />;
    case 'STUDENT':
      return <Navigate to="/student/home" replace />;
    default:
      return <div>Unauthorized role: {user.role}</div>;
  }
}
