import React, { useState, useRef, useEffect } from 'react';
import './PostGrades.css';
import Navbar from './InstNavbar.jsx';
import { uploadGradesFile } from '../../api/grades';
import { getCreditsBalance } from '../../api/credits';
import { useAuth } from '../../auth/AuthContext';

function PostGrades({ type }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(null);
  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const institutionId = user?.institution_id ?? user?.inst;

  const isFinal = type === 'final';
  const title = isFinal ? 'FINAL GRADES POSTING' : 'INITIAL GRADES POSTING';
  const buttonLabel = isFinal ? 'submit FINAL grades' : 'submit INITIAL grades';

  useEffect(() => {
    // ✅ Φέρνουμε credits μόνο για initial
    if (isFinal || !institutionId) return;

    const fetchCredits = async () => {
      try {
        const { balance } = await getCreditsBalance(institutionId);
        setCredits(balance);
      } catch (err) {
        console.error('Failed to fetch credits', err);
        setCredits(0);
      }
    };

    fetchCredits();
  }, [institutionId, isFinal]);

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

      // Κάνε refresh μόνο στο initial
      if (!isFinal) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
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

          {/* ✅ Εμφάνιση credits μόνο στο initial */}
          {!isFinal && credits !== null && (
            <div className="credits-info">
              Διαθέσιμα credits: <strong>{credits}</strong>
            </div>
          )}

          <div className="grades-upload-row">
            <input
              type="file"
              className="grades-file-input"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            <button
              className="grades-btn"
              onClick={handleUpload}
              disabled={!isFinal && credits === 0}
            >
              {buttonLabel}
            </button>
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
