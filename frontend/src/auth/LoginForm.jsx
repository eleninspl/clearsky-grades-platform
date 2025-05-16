import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButtonRow from './LoginButtonRow';

export default function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role');
      return;
    }

    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    navigate('/');
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="login-input"
      >
        <option value="">-- Select Role --</option>
        <option value="STUDENT">Student</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="INST_REP">Institution Representative</option>
      </select>

      <input
        type="text"
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input type="password" placeholder="Password" className="login-input" />

      <LoginButtonRow />
    </form>
  );
}
