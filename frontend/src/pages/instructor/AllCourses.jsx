import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllCourses.css';
import Navbar from './InstNavbar.jsx';

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

const dummyCharts = Object.fromEntries(
  allCourses.map(course => [
    course.name,
    [
      { title: `${course.name} - spring 2025 - total` },
      { title: `${course.name} - spring 2025 - Q1` },
      { title: `${course.name} - spring 2025 - Q2` },
      { title: `${course.name} - spring 2025 - Q3` },
      { title: `${course.name} - spring 2025 - Q4` }
    ]
  ])
);

function AllCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleClosePopup = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="courses-container">
      <Navbar />
      <main className="courses-main">
        <div className="courses-table-section">
          <div className="courses-header">
            <h2 className="courses-title">All My Courses</h2>
            <button 
              className="courses-back-btn"
              onClick={() => navigate('/instructor/statistics')}
            >
              Back to Overview
            </button>
          </div>
          <table className="courses-table">
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
                  className="courses-table-row"
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
          <div className="courses-popup-overlay" onClick={handleClosePopup}>
            <div className="courses-popup" onClick={e => e.stopPropagation()}>
              <div className="courses-popup-header">
                <h3>{selectedCourse.name}</h3>
                <button className="courses-popup-close" onClick={handleClosePopup}>×</button>
              </div>
              <div className="courses-popup-content">
                <div className="courses-popup-description">
                  <h4>Course Description</h4>
                  <p>{selectedCourse.description}</p>
                </div>
                <div className="courses-popup-charts">
                  <h4>Course Statistics</h4>
                  <div className="courses-charts-grid">
                    {(dummyCharts[selectedCourse.name] || []).map((chart, idx) => (
                      <div
                        key={chart.title}
                        className={
                          idx === 0
                            ? 'courses-chart-cell courses-chart-large'
                            : 'courses-chart-cell'
                        }
                      >
                        <div className="courses-chart-title">{chart.title}</div>
                        <div className="courses-chart-placeholder">[Chart Placeholder]</div>
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
