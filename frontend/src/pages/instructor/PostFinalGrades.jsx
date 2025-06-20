import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostFinalGrades.css';
import Navbar from './InstNavbar.jsx';
import { uploadGradesFile } from '../../api/grades'; // ✅ import

function PostFinalGrades() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null); // ✅ file state
  const [message, setMessage] = useState(''); // ✅ message state

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
      const res = await uploadGradesFile(file, 'final');
      setMessage('✅ Upload successful: ' + res.message);
    } catch (err) {
      setMessage('❌ Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleConfirm = () => {
    navigate('/instructor/dashboard');
  };

  return (
    <div className="grades-container">
      <Navbar />
      <main className="grades-main">
        <h2 className="instructor-name">Instructor name</h2>

        <section className="grades-section">
          <div className="grades-section-title">FINAL GRADES POSTING</div>
          <div className="grades-upload-row">
            <input type="file" className="grades-file-input" onChange={handleFileChange} /> {/* ✅ file input */}
            <button className="grades-btn" onClick={handleUpload}>submit FINAL grades</button> {/* ✅ trigger upload */}
          </div>
        </section>

        <section className="grades-message-area">
          <div className="grades-message-title">Message area</div>
          <div className="grades-message-box">{message}</div> {/* ✅ display message */}
        </section>
      </main>
    </div>
  );
}

export default PostFinalGrades;
