import React from 'react';
import './RepStatistics.css';
import RepNavbar from './RepNavbar.jsx';

function RepStatistics() {
  return (
    <div className="rep-stats-container">
      <RepNavbar />
      <main className="rep-stats-main">
        <div className="rep-stats-section">
          <h2 className="rep-stats-title">Institution Statistics</h2>
          <div className="rep-stats-grid">
            <div className="rep-stats-card">
              <h3>Total Students</h3>
              <div className="rep-stats-value">1,234</div>
            </div>
            <div className="rep-stats-card">
              <h3>Total Instructors</h3>
              <div className="rep-stats-value">45</div>
            </div>
            <div className="rep-stats-card">
              <h3>Active Courses</h3>
              <div className="rep-stats-value">67</div>
            </div>
            <div className="rep-stats-card">
              <h3>Average Grade</h3>
              <div className="rep-stats-value">7.8</div>
            </div>
          </div>
          <div className="rep-stats-charts">
            <div className="rep-stats-chart">
              <h3>Grade Distribution</h3>
              <div className="rep-stats-chart-placeholder">[Grade Distribution Chart]</div>
            </div>
            <div className="rep-stats-chart">
              <h3>Course Enrollment</h3>
              <div className="rep-stats-chart-placeholder">[Course Enrollment Chart]</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RepStatistics;
