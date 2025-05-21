import React, { useState } from 'react';
import Login from '../auth/Login.jsx';
import RoleRouter from '../routing/RoleRouter';
import CourseStatistics from '../instructor/CourseStatistics.jsx';
import Notifications from '../instructor/Notifications.jsx';
import PostInitialGrades from '../instructor/PostInitialGrades.jsx';
import PostFinalGrades from '../instructor/PostFinalGrades.jsx';
import RepStatistics from '../representative/RepStatistics.jsx';
import RepCredits from '../representative/RepCredits.jsx';
import AddUser from '../representative/AddUser.jsx';
import AllCourses from '../instructor/AllCourses.jsx';

function App() {
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleComponentChange = (component) => {
    console.log('Changing component to:', component);
    setCurrentComponent(component);
  };

  if (currentComponent) {
    const ComponentToRender = {
      CourseStatistics: <CourseStatistics setCurrentComponent={handleComponentChange} />,
      Notifications: <Notifications setCurrentComponent={handleComponentChange} />,
      PostInitialGrades: <PostInitialGrades setCurrentComponent={handleComponentChange} />,
      PostFinalGrades: <PostFinalGrades setCurrentComponent={handleComponentChange} />,
      RepStatistics: <RepStatistics setCurrentComponent={handleComponentChange} />,
      RepCredits: <RepCredits setCurrentComponent={handleComponentChange} />,
      AddUser: <AddUser setCurrentComponent={handleComponentChange} />,
      Login: <Login setCurrentComponent={handleComponentChange} />,
      AllCourses: <AllCourses setCurrentComponent={handleComponentChange} />,
    }[currentComponent];

    return ComponentToRender || <div>Component not found</div>;
  }

  localStorage.removeItem('role'); // reset on every reload
  const role = localStorage.getItem('role');

  return (
    <div>
      {!role ? (
        <Login setCurrentComponent={handleComponentChange} />
      ) : (
        <RoleRouter 
          role={role} 
          currentComponent={currentComponent} 
          setCurrentComponent={handleComponentChange} 
        />
      )}
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