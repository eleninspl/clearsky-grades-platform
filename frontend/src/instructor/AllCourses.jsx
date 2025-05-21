import React, { useState } from 'react';
import './CourseStatistics.css';
import Navbar from './InstNavbar.jsx';

// Extended list of courses for demonstration
const allCourses = [
  {
    name: 'physics',
    period: 'fall 2024',
    initial: '2025-02-22',
    final: '2025-02-28',
    description: 'Introduction to classical mechanics, thermodynamics, and electromagnetism. Covers fundamental principles and their applications in real-world scenarios.'
  },
  {
    name: 'software',
    period: 'fall 2024',
    initial: '2025-02-01',
    final: '',
    description: 'Software engineering principles, design patterns, and development methodologies. Focus on practical implementation and best practices.'
  },
  {
    name: 'mathematics',
    period: 'fall 2024',
    initial: '2025-02-02',
    final: '2025-02-14',
    description: 'Advanced calculus, linear algebra, and mathematical analysis. Emphasis on theoretical foundations and problem-solving techniques.'
  },
  {
    name: 'computer networks',
    period: 'fall 2024',
    initial: '2025-02-15',
    final: '2025-02-21',
    description: 'Network protocols, architecture, and security. Hands-on experience with network configuration and troubleshooting.'
  },
  {
    name: 'databases',
    period: 'fall 2024',
    initial: '2025-02-10',
    final: '2025-02-16',
    description: 'Database design, SQL, and data management. Covers both relational and NoSQL database systems.'
  },
  {
    name: 'operating systems',
    period: 'fall 2024',
    initial: '2025-02-05',
    final: '2025-02-11',
    description: 'OS concepts, process management, memory management, and file systems. Practical experience with system programming.'
  },
  {
    name: 'algorithms',
    period: 'fall 2024',
    initial: '2025-02-08',
    final: '2025-02-14',
    description: 'Algorithm design and analysis. Focus on efficiency, complexity, and optimization techniques.'
  },
  {
    name: 'web development',
    period: 'fall 2024',
    initial: '2025-02-12',
    final: '2025-02-18',
    description: 'Modern web development technologies and frameworks. Full-stack development with focus on user experience.'
  }
];

const dummyCharts = {
  physics: [
    { title: 'physics - spring 2025 - total' },
    { title: 'physics - spring 2025 - Q1' },
    { title: 'physics - spring 2025 - Q2' },
    { title: 'physics - spring 2025 - Q3' },
    { title: 'physics - spring 2025 - Q4' },
  ],
  software: [
    { title: 'software - spring 2025 - total' },
    { title: 'software - spring 2025 - Q1' },
    { title: 'software - spring 2025 - Q2' },
    { title: 'software - spring 2025 - Q3' },
    { title: 'software - spring 2025 - Q4' },
  ],
  mathematics: [
    { title: 'mathematics - spring 2025 - total' },
    { title: 'mathematics - spring 2025 - Q1' },
    { title: 'mathematics - spring 2025 - Q2' },
    { title: 'mathematics - spring 2025 - Q3' },
    { title: 'mathematics - spring 2025 - Q4' },
  ],
  'computer networks': [
    { title: 'computer networks - spring 2025 - total' },
    { title: 'computer networks - spring 2025 - Q1' },
    { title: 'computer networks - spring 2025 - Q2' },
    { title: 'computer networks - spring 2025 - Q3' },
    { title: 'computer networks - spring 2025 - Q4' },
  ],
  databases: [
    { title: 'databases - spring 2025 - total' },
    { title: 'databases - spring 2025 - Q1' },
    { title: 'databases - spring 2025 - Q2' },
    { title: 'databases - spring 2025 - Q3' },
    { title: 'databases - spring 2025 - Q4' },
  ],
  'operating systems': [
    { title: 'operating systems - spring 2025 - total' },
    { title: 'operating systems - spring 2025 - Q1' },
    { title: 'operating systems - spring 2025 - Q2' },
    { title: 'operating systems - spring 2025 - Q3' },
    { title: 'operating systems - spring 2025 - Q4' },
  ],
  algorithms: [
    { title: 'algorithms - spring 2025 - total' },
    { title: 'algorithms - spring 2025 - Q1' },
    { title: 'algorithms - spring 2025 - Q2' },
    { title: 'algorithms - spring 2025 - Q3' },
    { title: 'algorithms - spring 2025 - Q4' },
  ],
  'web development': [
    { title: 'web development - spring 2025 - total' },
    { title: 'web development - spring 2025 - Q1' },
    { title: 'web development - spring 2025 - Q2' },
    { title: 'web development - spring 2025 - Q3' },
    { title: 'web development - spring 2025 - Q4' },
  ],
};

function AllCourses({ setCurrentComponent }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleClosePopup = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="stats-container">
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main className="stats-main">
        <div className="stats-table-section">
          <div className="stats-header">
            <h2 className="stats-title">All My Courses</h2>
            <button 
              className="stats-back-btn"
              onClick={() => setCurrentComponent('CourseStatistics')}
            >
              Back to Overview
            </button>
          </div>
          <table className="stats-table">
            <thead>
              <tr>
                <th>course name</th>
                <th>exam period</th>
                <th>initial grades submission</th>
                <th>final grades submission</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course) => (
                <tr 
                  key={course.name}
                  onClick={() => handleCourseClick(course)}
                  style={{ cursor: 'pointer' }}
                  className="stats-table-row"
                >
                  <td>{course.name}</td>
                  <td>{course.period}</td>
                  <td>{course.initial}</td>
                  <td>{course.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCourse && (
          <div className="stats-popup-overlay" onClick={handleClosePopup}>
            <div className="stats-popup" onClick={e => e.stopPropagation()}>
              <div className="stats-popup-header">
                <h3>{selectedCourse.name}</h3>
                <button className="stats-popup-close" onClick={handleClosePopup}>×</button>
              </div>
              <div className="stats-popup-content">
                <div className="stats-popup-description">
                  <h4>Course Description</h4>
                  <p>{selectedCourse.description}</p>
                </div>
                <div className="stats-popup-charts">
                  <h4>Course Statistics</h4>
                  <div className="stats-charts-grid">
                    {(dummyCharts[selectedCourse.name] || []).map((chart, idx) => (
                      <div
                        key={chart.title}
                        className={
                          idx === 0
                            ? 'stats-chart-cell stats-chart-large'
                            : 'stats-chart-cell'
                        }
                      >
                        <div className="stats-chart-title">{chart.title}</div>
                        <div className="stats-chart-placeholder">[Chart Placeholder]</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AllCourses; 