import React, { useState } from 'react';
import Login from '../auth/Login.jsx';
import RoleRouter from '../routing/RoleRouter';
import CourseStatistics from '../instructor/CourseStatistics.jsx';
import Notifications from '../components/Notifications.jsx';
import PostInitialGrades from '../instructor/grades/PostInitialGrades.jsx';
import PostFinalGrades from '../instructor/grades/PostFinalGrades.jsx';
import RegisterInstitution from '../auth/RegisterInstitution.jsx';
import RepStatistics from '../representative/RepStatistics.jsx';
import RepCredits from '../representative/RepCredits.jsx';
import AddUser from '../components/AddUser.jsx';

function App() {
  const [currentComponent, setCurrentComponent] = useState(null);

  if (currentComponent) {
    const ComponentToRender = {
      CourseStatistics: <CourseStatistics setCurrentComponent={setCurrentComponent} />,
      Notifications: <Notifications setCurrentComponent={setCurrentComponent} />,
      PostInitialGrades: <PostInitialGrades setCurrentComponent={setCurrentComponent} />,
      PostFinalGrades: <PostFinalGrades setCurrentComponent={setCurrentComponent} />,
      RegisterInstitution: <RegisterInstitution setCurrentComponent={setCurrentComponent} />,
      RepStatistics: <RepStatistics setCurrentComponent={setCurrentComponent} />,
      RepCredits: <RepCredits setCurrentComponent={setCurrentComponent} />,
      AddUser: <AddUser setCurrentComponent={setCurrentComponent} />,
      Login: <Login setCurrentComponent={setCurrentComponent} />,
    }[currentComponent];

    return ComponentToRender || <div>Component not found</div>;
  }

  localStorage.removeItem('role'); // reset on every reload
  const role = localStorage.getItem('role');

  return (
    <div>
      {!role ? <Login setCurrentComponent={setCurrentComponent} /> : <RoleRouter role={role} setCurrentComponent={setCurrentComponent} />}
    </div>
  );
}

export default App;

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import PostInitialGrades from './PostInitialGrades.jsx';
import PostFinalGrades from './PostFinalGrades.jsx';
import CourseStatistics from './CourseStatistics.jsx';
import Notifications from './Notifications.jsx';
import RegisterInstitution from './RegisterInstitution.jsx';
import RepCredits from './RepCredits.jsx';
import RepStatistics from './RepStatistics.jsx';
import AddUser from './AddUser.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/post-initial-grades" element={<PostInitialGrades />} />
        <Route path="/post-final-grades" element={<PostFinalGrades />} />
        <Route path="/course-statistics" element={<CourseStatistics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
        <Route path="/rep-grades" element={<RepStatistics />} />
        <Route path="/rep-credits" element={<RepCredits />} />
        <Route path="/add-user" element={<AddUser />} />
      </Routes>
    </Router>
  );
}

export default App;
*/