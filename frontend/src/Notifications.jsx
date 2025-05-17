import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import './Notifications.css';

const notifications = [
  { course: 'software II', period: 'spring 2025', student: 'john doe' },
  { course: 'software II', period: 'spring 2025', student: 'jane doe' },
  { course: 'software I', period: 'fall 2024', student: 'george smith' },
];

function Notifications({ setCurrentComponent }) {
  const [selectedReply, setSelectedReply] = useState(null);
  const [action, setAction] = useState('Total accept');
  const [message, setMessage] = useState('');

  return (
    <div className="notifications-container">
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main className="notifications-main">
        <h2 className="notifications-instructor">Instructor name</h2>
        <table className="notifications-table">
          <thead>
            <tr>
              <th>course name</th>
              <th>exam period</th>
              <th>student</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n, idx) => (
              <tr key={idx}>
                <td>{n.course}</td>
                <td>{n.period}</td>
                <td>{n.student}</td>
                <td>
                  <button
                    className="notifications-reply-btn"
                    onClick={() => setSelectedReply(idx)}
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedReply !== null && (
          <div className="notifications-reply-form-wrapper">
            <div className="notifications-reply-form-title">
              REPLY TO GRADE REVIEW REQUEST &nbsp; <b>{notifications[selectedReply].course}</b> &nbsp; {notifications[selectedReply].period} &nbsp; <b>{notifications[selectedReply].student}</b>
            </div>
            <form className="notifications-reply-form">
              <div className="notifications-reply-row">
                <label>Action</label>
                <select value={action} onChange={e => setAction(e.target.value)}>
                  <option>Total accept</option>
                  <option>Partial accept</option>
                  <option>Reject</option>
                </select>
              </div>
              <div className="notifications-reply-row">
                <label>instructor's message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="notifications-reply-textarea"
                />
              </div>
              <div className="notifications-reply-row notifications-reply-row-end">
                <button type="button" className="notifications-upload-btn">upload reply attachment</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;