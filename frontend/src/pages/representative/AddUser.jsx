import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepNavbar from './RepNavbar.jsx';
import './AddUser.css';
import { createUserByRole } from '../../api/auth.js';

const userTypes = [
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
];

function AddUser() {
  const [type, setType] = useState(userTypes[0].value);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState(''); // ✅ added for student ID
  const [googleEmail, setGoogleEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      password,
      role: type.toUpperCase(),
    };

    // ✅ Only include ID if role is STUDENT
    if (type === 'student') {
      payload.id = id;
    }

    try {
      await createUserByRole(payload);
      navigate('/representative/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create user');
    }
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
              <label>email</label>
              <input type="email" className="adduser-input" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {type === 'student' && (
              <div className="adduser-form-row">
                <label>Google email</label>
                <input type="email" className="adduser-input" value={googleEmail} onChange={e => setGoogleEmail(e.target.value)} placeholder="(optional)" />
              </div>
            )}
            <div className="adduser-form-row">
              <label>password</label>
              <input type="password" className="adduser-input" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {/* ✅ Conditionally show ID field only for students */}
            {type === 'student' && (
              <div className="adduser-form-row">
                <label>AM</label>
                <input type="text" className="adduser-input" value={id} onChange={e => setId(e.target.value)} />
              </div>
            )}

            <div className="adduser-btn-row">
              <button type="submit" className="adduser-btn">Add user</button>
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
