import React, { useState } from 'react';
import './StudentViewGrades.css';
import StudentNavbar from './StudentNavbar';

const myGrades = [
  {
    name: 'physics',
    period: 'spring 2025',
    finalGrade: 8.5,
    charts: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  {
    name: 'software',
    period: 'fall 2024',
    finalGrade: 7.3,
    charts: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  {
    name: 'mathematics',
    period: 'fall 2024',
    finalGrade: 9.0,
    charts: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
];

function StudentViewGrades() {
  const [selected, setSelected] = useState(myGrades[0]);

  return (
    <div className="student-viewgrades-container">
      <StudentNavbar />
      <main className="student-viewgrades-main">
        <h2 className="student-viewgrades-title">My Grade</h2>

        <div className="student-viewgrades-selector">
          <label>Select course:</label>
          <select
            value={selected.name}
            onChange={(e) =>
              setSelected(myGrades.find((c) => c.name === e.target.value))
            }
          >
            {myGrades.map((course) => (
              <option key={course.name} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="student-viewgrades-info">
          <p><strong>Exam period:</strong> {selected.period}</p>
          <p><strong>Final grade:</strong> {selected.finalGrade}</p>
        </div>

        <div className="student-viewgrades-charts">
          {selected.charts.map((q) => (
            <div key={q} className="student-viewgrades-chart">
              <div className="student-viewgrades-chart-title">{q}</div>
              <div className="student-viewgrades-chart-placeholder">[Chart Placeholder]</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StudentViewGrades;
