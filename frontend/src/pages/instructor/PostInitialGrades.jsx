import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostInitialGrades.css';
import Navbar from './InstNavbar.jsx';
import { uploadGradesFile } from '../../api/orchestrator.js'; // ✅ added

function PostInitialGrades() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null); // ✅ added
  const [message, setMessage] = useState(''); // ✅ added

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
      const res = await uploadGradesFile(file, 'initial'); // ✅ call backend
      setMessage('✅ Upload successful: ' + res.message);
    } catch (err) {
      setMessage('❌ Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    navigate('/instructor/dashboard');
  };

  return (
    <div className="grades-container">
      <Navbar />
      <main className="grades-main">
        <h2 className="instructor-name">Instructor name</h2>

        <section className="grades-section">
          <div className="grades-section-title">INITIAL GRADES POSTING</div>
          <div className="grades-upload-row">
            <input type="file" className="grades-file-input" onChange={handleFileChange} /> {/* ✅ added onChange */}
            <button className="grades-btn" onClick={handleUpload}>submit initial grades</button> {/* ✅ added onClick */}
          </div>
        </section>

        <section className="grades-section">
          <div className="grades-section-title">XLSX file parsing</div>
          <form className="grades-parsing-form">
            <div className="grades-form-row">
              <label>Course:</label>
              <input type="text" className="grades-input" placeholder="Course name" />
            </div>
            <div className="grades-form-row">
              <label>Period:</label>
              <input type="text" className="grades-input" placeholder="Exam period" />
            </div>
            <div className="grades-form-row">
              <label>n. of grades</label>
              <input type="text" className="grades-input" placeholder="N" />
            </div>
            <div className="grades-btn-row">
              <button className="grades-btn" type="submit" onClick={handleConfirm}>CONFIRM</button>
              <button className="grades-btn" type="button">CANCEL</button>
            </div>
          </form>
        </section>

        <section className="grades-message-area">
          <div className="grades-message-title">Message area</div>
          <div className="grades-message-box">{message}</div> {/* ✅ shows success/error */}
        </section>
      </main>
    </div>
  );
}

export default PostInitialGrades;
