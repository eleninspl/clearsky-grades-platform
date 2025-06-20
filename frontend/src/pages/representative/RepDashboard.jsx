import React, { useEffect, useState } from 'react';
import './RepDashboard.css';
import RepNavbar from './RepNavbar.jsx';
import { getInstitutionStats } from '../../api/orchestrator';

function RepDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    active_courses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstitutionStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="rep-stats-container">
      <RepNavbar />
      <main className="rep-stats-main">
        <div className="rep-stats-section">
          <h2 className="rep-stats-title">Institution Statistics</h2>
          <div className="rep-stats-grid">
            <div className="rep-stats-card">
              <h3>Total Students</h3>
              <div className="rep-stats-value">
                {loading ? '...' : stats.students}
              </div>
            </div>
            <div className="rep-stats-card">
              <h3>Total Instructors</h3>
              <div className="rep-stats-value">
                {loading ? '...' : stats.instructors}
              </div>
            </div>
            <div className="rep-stats-card">
              <h3>Active Courses</h3>
              <div className="rep-stats-value">
                {loading ? '...' : stats.active_courses}
              </div>
            </div>
          </div>
          <div className="rep-stats-charts">
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

export default RepDashboard;
