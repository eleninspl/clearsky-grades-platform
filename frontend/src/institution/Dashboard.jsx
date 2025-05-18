import React, { useEffect } from 'react';
import RepNavbar from '../RepNavbar.jsx';

export default function InstitutionDashboard({ setCurrentComponent }) {
  useEffect(() => {
    setCurrentComponent('RegisterInstitution');
  }, [setCurrentComponent]);

  return (
    <div>
      <RepNavbar setCurrentComponent={setCurrentComponent} />
      <main>
        <h1>Institution Dashboard</h1>
      </main>
    </div>
  );
}
  