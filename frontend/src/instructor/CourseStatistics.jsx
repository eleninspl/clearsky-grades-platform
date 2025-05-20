import React, { useState } from 'react';
import './CourseStatistics.css';
import Navbar from './InstNavbar.jsx';

const courses = [
  {
    name: 'physics',
    period: 'fall 2024',
    initial: '2025-02-22',
    final: '2025-02-28',
  },
  {
    name: 'software',
    period: 'fall 2024',
    initial: '2025-02-01',
    final: '',
  },
  {
    name: 'mathematics',
    period: 'fall 2024',
    initial: '2025-02-02',
    final: '2025-02-14',
  },
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
};

function CourseStatistics({ setCurrentComponent }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].name);

  return (
    <div className="stats-container">
      <Navbar setCurrentComponent={setCurrentComponent} />
      <main className="stats-main">
        <div className="stats-table-section">
          <h2 className="stats-title">Available course statistics</h2>
          <button className="stats-goto-btn">Go to my courses</button>
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
              {courses.map((course) => (
                <tr
                  key={course.name}
                  className={selectedCourse === course.name ? 'stats-row-selected' : ''}
                  onClick={() => setSelectedCourse(course.name)}
                  style={{ cursor: 'pointer' }}
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
        <div className="stats-charts-section">
          {dummyCharts[selectedCourse].map((chart, idx) => (
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
          <div className="stats-chart-cell stats-chart-ellipsis">
            <div className="stats-chart-placeholder">...</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseStatistics; 