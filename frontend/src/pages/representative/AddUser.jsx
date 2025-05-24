import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepNavbar from './RepNavbar.jsx';
import './AddUser.css';

const userTypes = [
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
];

function AddUser() {
  const [type, setType] = useState(userTypes[0].value);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to create user
    navigate('/representative/dashboard');
  };

  const handleChangePassword = () => {
    // TODO: Add change password functionality
    navigate('/representative/dashboard');
  };

  return (
    <div className="adduser-container">
      <RepNavbar />
      <main className="adduser-main">
        <section className="adduser-section">
          <div className="adduser-title">Users</div>
          <form className="adduser-form" onSubmit={handleSubmit}>
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
              <button type="submit" className="adduser-btn">Add user</button>
              <button type="button" className="adduser-btn" onClick={handleChangePassword}>Change passw</button>
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
