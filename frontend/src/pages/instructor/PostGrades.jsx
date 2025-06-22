// PostGrades.jsx
import React, { useState, useRef } from 'react';
import './PostGrades.css'; // You can unify styling
import Navbar from './InstNavbar.jsx';
import { uploadGradesFile } from '../../api/grades';

function PostGrades({ type }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const isFinal = type === 'final';
  const title = isFinal ? 'FINAL GRADES POSTING' : 'INITIAL GRADES POSTING';
  const buttonLabel = isFinal ? 'submit FINAL grades' : 'submit INITIAL grades';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }
  
    try {
      setMessage('Uploading...');
      const res = await uploadGradesFile(file, type);
      setMessage('✅ Upload successful: ' + res.message);
    } catch (err) {
      console.error('⛔️ Detailed error:', err);
  
      const realMessage =
        err?.error ||
        err?.response?.data?.error ||
        err?.message ||
        'Παρουσιάστηκε άγνωστο σφάλμα.';
  
      setMessage(` ${realMessage}`);
    } finally {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };
  

  return (
    <div className="grades-container">
      <Navbar />
      <main className="grades-main">
        <h2 className="instructor-name">Instructor name</h2>

        <section className="grades-section">
          <div className="grades-section-title">{title}</div>
          <div className="grades-upload-row">
            <input
              type="file"
              className="grades-file-input"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            <button className="grades-btn" onClick={handleUpload}>{buttonLabel}</button>
          </div>
        </section>

        <section className="grades-message-area">
          <div className="grades-message-title">Message area</div>
          <div className="grades-message-box">{message}</div>
        </section>
      </main>
    </div>
  );
}

export default PostGrades;
