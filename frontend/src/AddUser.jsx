import React, { useState } from 'react';
import RepNavbar from './RepNavbar';
import './AddUser.css';

const userTypes = [
  { value: 'representative', label: 'Representative' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
];

function AddUser({ setCurrentComponent }) {
  const [type, setType] = useState(userTypes[0].value);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');

  return (
    <div className="adduser-container">
      <RepNavbar setCurrentComponent={setCurrentComponent} />
      <main className="adduser-main">
        <section className="adduser-section">
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
              <input type="text" className="adduser-input" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="adduser-form-row">
              <label>password</label>
              <input type="password" className="adduser-input" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="adduser-form-row">
              <label>id</label>
              <input type="text" className="adduser-input" value={id} onChange={e => setId(e.target.value)} />
            </div>
            <div className="adduser-btn-row">
              <button type="button" className="adduser-btn">Add user</button>
              <button type="button" className="adduser-btn">Change passw</button>
            </div>
          </form>
        </section>
        <section className="adduser-section">
          <div className="adduser-title">Message area</div>
          <div className="adduser-message-content"></div>
        </section>
      </main>
    </div>
  );
}

export default AddUser; 