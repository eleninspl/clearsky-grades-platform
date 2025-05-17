import React from 'react';
import './PostInitialGrades.css';
import Navbar from './Navbar.jsx';

function PostInitialGrades({ setCurrentComponent }) {
  const handleConfirm = (e) => {
    e.preventDefault();
    setCurrentComponent('CourseStatistics');
  };

  return (
    <div className="grades-container">
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main className="grades-main">
        <h2 className="instructor-name">Instructor name</h2>
        <section className="grades-section">
          <div className="grades-section-title">INITIAL GRADES POSTING</div>
          <div className="grades-upload-row">
            <input type="file" className="grades-file-input" />
            <button className="grades-btn">submit initial grades</button>
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
          <div className="grades-message-box"></div>
        </section>
      </main>
    </div>
  );
}

export default PostInitialGrades;