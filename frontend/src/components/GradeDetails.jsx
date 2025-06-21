import React from 'react';
import SimpleBarChart from './SimpleBarChart';

function GradeDetails({ grades, activeGradeCourse, statistics, statsLoading, statsError, gradeType }) {
  const courseGrades = grades.filter(c => c.course_title === activeGradeCourse);
  const final = courseGrades.find(c => c.type === 'FINAL');
  const initial = courseGrades.find(c => c.type === 'INITIAL');
  const totalGrade = final?.grade || initial?.grade || '';
  const detailed = final?.detailed_grade_json || initial?.detailed_grade_json || {};

  return (
    <div className="student-courses-grade-wrapper">
      <div className="student-courses-grade-grid">
        <div className="student-courses-grade-box">
          <h4>My Grades – {activeGradeCourse}</h4>
          <div className="student-courses-grade-labels">
            <label>Total</label>
            <input type="text" readOnly value={totalGrade} />
            {Object.entries(detailed).map(([key, val]) => (
              <React.Fragment key={key}>
                <label>{key.toUpperCase()}</label>
                <input type="text" readOnly value={val} />
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="student-courses-grade-chartbox">
          <h4>{activeGradeCourse} – Statistics ({gradeType})</h4>

          {statsLoading && <p>Loading charts...</p>}
          {statsError && <p>{statsError}</p>}

          {!statsLoading && statistics?.length > 0 && (
            <div className="student-courses-charts-scroll">
              <div className="chart-card">
                <h5>Total</h5>
                <SimpleBarChart
                  data={statistics.find((s) => s.label === 'total')?.data || []}
                  height={280}
                />
              </div>
              {statistics
                .filter((s) => s.label !== 'total')
                .map((stat) => (
                  <div key={stat.label} className="chart-card">
                    <h5>{stat.label}</h5>
                    <SimpleBarChart data={stat.data} height={280} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GradeDetails;
