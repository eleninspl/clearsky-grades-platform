import React from 'react';
import styles from './CourseCharts.module.css';
import SimpleBarChart from './SimpleBarChart';

function CourseCharts({ courseName, statistics }) {
  if (!statistics || statistics.length === 0) return null;

  const totalStats = statistics.find((s) => s.label === 'total');
  const questionStats = statistics.filter((s) => s.label !== 'total');

  return (
    <div className={styles.chartsGrid}>
      {totalStats && (
        <div className={`${styles.chartCard} ${styles.largeChart}`}>
          <h3 className={styles.chartTitle}>{courseName} – Total Distribution</h3>
          <SimpleBarChart data={totalStats.data} height={300} />
        </div>
      )}

      {questionStats.map((stat) => (
        <div key={stat.label} className={styles.chartCard}>
          <h4 className={styles.chartTitle}>{courseName} – {stat.label}</h4>
          <SimpleBarChart data={stat.data} height={160} />
        </div>
      ))}
    </div>
  );
}

export default CourseCharts;
