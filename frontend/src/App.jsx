import React, { useState } from 'react';
import Login from './Login.jsx';
import RoleRouter from './routing/RoleRouter';
import CourseStatistics from './CourseStatistics.jsx';
import Notifications from './Notifications.jsx';
import PostInitialGrades from './PostInitialGrades.jsx';
import PostFinalGrades from './PostFinalGrades.jsx';
import RegisterInstitution from './RegisterInstitution.jsx';

function App() {
  const [currentComponent, setCurrentComponent] = useState(null);

  if (currentComponent) {
    const ComponentToRender = {
      CourseStatistics: <CourseStatistics setCurrentComponent={setCurrentComponent} />,
      Notifications: <Notifications setCurrentComponent={setCurrentComponent} />,
      PostInitialGrades: <PostInitialGrades setCurrentComponent={setCurrentComponent} />,
      PostFinalGrades: <PostFinalGrades setCurrentComponent={setCurrentComponent} />,
      RegisterInstitution: <RegisterInstitution setCurrentComponent={setCurrentComponent} />,
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