import React from 'react';
import StudentDashboard from '../student/Dashboard';
import InstructorDashboard from '../instructor/Dashboard';
import RepresentativeDashboard from '../representative/Dashboard';
import CourseStatistics from '../instructor/CourseStatistics';
import AllCourses from '../instructor/AllCourses';

export default function RoleRouter({ role, currentComponent, setCurrentComponent }) {
  switch (role) {
    case 'STUDENT':
      return <StudentDashboard setCurrentComponent={setCurrentComponent} />;
    case 'INSTRUCTOR':
      switch (currentComponent) {
        case 'CourseStatistics':
          return <CourseStatistics setCurrentComponent={setCurrentComponent} />;
        case 'AllCourses':
          return <AllCourses setCurrentComponent={setCurrentComponent} />;
        default:
          return <InstructorDashboard setCurrentComponent={setCurrentComponent} />;
      }
    case 'INST_REP':
      return <RepresentativeDashboard setCurrentComponent={setCurrentComponent} />;
    default:
      return <div>No role selected. Please log in.</div>;
  }
} 