import React, { useState, useEffect } from 'react';
import Navbar from './InstNavbar.jsx';
import './Notifications.css';
import { getReviewRequestsByInstructor, submitReviewResponse } from '../../api/reviews';
import { useAuth } from '../../auth/AuthContext';

function Notifications() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [action, setAction] = useState('Total accept');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getReviewRequestsByInstructor(user.id)
      .then(setRequests)
      .catch(() => setError('Failed to fetch review requests'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="notifications-container">
      <Navbar />
      <main className="notifications-main">
        <h2 className="notifications-instructor">{user?.full_name || 'Instructor name'}</h2>
        {successMsg && <div style={{color: 'green', marginBottom: 12}}>{successMsg}</div>}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>course title</th>
                  <th>exam period</th>
                  <th>student</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr><td colSpan={4}>No review requests.</td></tr>
                )}
                {requests.map((n, idx) => (
                  <tr key={n.review_id}>
                    <td>{n.course_title}</td>
                    <td>{n.exam_period}</td>
                    <td>{n.student_name}</td>
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

            {selectedReply !== null && requests[selectedReply] && (
              <div className="notifications-reply-form-wrapper">
                <div className="notifications-reply-form-title">
                  REPLY TO GRADE REVIEW REQUEST &nbsp;
                  <b>{requests[selectedReply].course_title}</b> &nbsp;
                  {requests[selectedReply].exam_period} &nbsp;
                  <b>{requests[selectedReply].student_name}</b>
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
                    <label>student's message</label>
                    <div className="notifications-student-message">
                      {requests[selectedReply].student_message}
                    </div>
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
                    <button
                      type="button"
                      className="notifications-upload-btn"
                      onClick={async () => {
                        const req = requests[selectedReply];
                        await submitReviewResponse({
                          review_request_id: req.review_id,
                          responder_id: user.id,
                          message
                        });                                              
                        // Refresh requests
                        if (user?.id) {
                          getReviewRequestsByInstructor(user.id).then(setRequests);
                        }                        
                        setSelectedReply(null);
                        setMessage(''); 
                        setSuccessMsg('Η απάντηση καταχωρήθηκε και το αίτημα αφαιρέθηκε από τα notifications.');
                        setTimeout(() => setSuccessMsg(''), 3000);
                      }}
                    >
                      upload reply
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Notifications;
