import styles from './CourseCharts.module.css';
import SimpleBarChart from './SimpleBarChart';

function CourseCharts({ courseName, statistics }) {
  if (!statistics || statistics.length === 0) return null;

  const totalStats = statistics.find((s) => s.label === 'total');
  const questionStats = statistics.filter((s) => s.label !== 'total');

  return (
    <div className={styles.chartsWrapper}>
      {totalStats && (
        <div className={styles.fixedLeft}>
          <h3 className={styles.chartTitle}>{courseName} – Total Distribution</h3>
          <SimpleBarChart data={totalStats.data} height={510} />
        </div>
      )}

      <div className={styles.scrollableRight}>
        {questionStats.map((stat) => (
          <div key={stat.label} className={styles.chartCard}>
            <h4 className={styles.chartTitle}>
              {courseName} – {stat.label}
            </h4>
            <SimpleBarChart data={stat.data} height={220} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseCharts;
