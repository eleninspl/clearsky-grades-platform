import StudentDashboard from '../student/Dashboard';
import InstructorDashboard from '../instructor/Dashboard';
import InstitutionDashboard from '../institution/Dashboard';

export default function RoleRouter({ role, setCurrentComponent }) {
  switch (role) {
    case 'STUDENT':
      return <StudentDashboard setCurrentComponent={setCurrentComponent} />;
    case 'INSTRUCTOR':
      return <InstructorDashboard setCurrentComponent={setCurrentComponent} />;
    case 'INST_REP':
      return <InstitutionDashboard setCurrentComponent={setCurrentComponent} />;
    default:
      return <div>No role selected. Please log in.</div>;
  }
}
