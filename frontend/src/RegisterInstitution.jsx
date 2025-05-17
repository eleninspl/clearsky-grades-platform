import React, { useState } from 'react';
import RepNavbar from './RepNavbar.jsx';
import './RegisterInstitution.css';

const userTypes = [
  { value: 'representative', label: 'Representative' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
];

function RegisterInstitution({ setCurrentComponent }) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [type, setType] = useState(userTypes[0].value);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');

  return (
    <div className="register-institution-container">
      <RepNavbar setCurrentComponent={setCurrentComponent} />
      <main className="register-institution-main">
        <section className="register-institution-section">
          <div className="register-institution-title">Institutions</div>
          <div className="register-institution-content">
            <button className="register-institution-adduser-btn" onClick={() => setShowAddUser(true)}>Add a user</button>
          </div>
        </section>
        <section className="register-institution-section">
          <div className="register-institution-title">Message area</div>
          <div className="register-institution-content"></div>
        </section>
      </main>

      {showAddUser && (
        <div className="adduser-modal-overlay">
          <div className="adduser-modal">
            <button className="adduser-modal-close" onClick={() => setShowAddUser(false)}>×</button>
            <div className="adduser-title">Users</div>
            <form className="adduser-form">
              <div className="adduser-form-row">
                <label>type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="adduser-input">
                  {userTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="adduser-form-row">
                <label>user name</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="adduser-input" />
              </div>
              <div className="adduser-form-row">
                <label>password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="adduser-input" />
              </div>
              <div className="adduser-form-row">
                <label>id</label>
                <input type="text" value={id} onChange={e => setId(e.target.value)} className="adduser-input" />
              </div>
              <div className="adduser-form-actions">
                <button type="button" className="adduser-btn" onClick={() => setCurrentComponent('CourseStatistics')}>Submit</button>
                <button type="button" className="adduser-btn" onClick={() => setShowAddUser(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterInstitution;