import { Routes, Route } from 'react-router-dom';
import StudentDashboard from '../student/Dashboard';
import InstructorDashboard from '../instructor/Dashboard';
import InstitutionDashboard from '../institution/Dashboard';

export default function RoleRouter({ role }) {
  switch (role) {
    case 'STUDENT':
      return (
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
        </Routes>
      );
    case 'INSTRUCTOR':
      return (
        <Routes>
          <Route path="/" element={<InstructorDashboard />} />
        </Routes>
      );
    case 'INST_REP':
      return (
        <Routes>
          <Route path="/" element={<InstitutionDashboard />} />
        </Routes>
      );
    default:
      return <div>No role selected. Please log in.</div>;
  }
}
