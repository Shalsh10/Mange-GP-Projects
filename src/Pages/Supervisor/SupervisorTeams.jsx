import React, { useEffect, useState } from 'react';
import supervisorService from '../services/supervisorService'; // عدل المسار حسب مكان الملف

const SupervisorTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await supervisorService.getSupervisedTeams();
        setTeams(data);
      } catch (err) {
        // تعامل مع الخطأ هنا
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <h2>قائمة التيمات المشرف عليها</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.teamName}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupervisorTeams;