import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DynamicAnalysis from './DynamicAnalysis';
import axios from 'axios';

const PatientAnalysis = () => {
  const { visitId } = useParams();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found');

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/doctor-api/report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { id: visitId }
        }
      );
      if (response.status !== 200) {
        throw new Error('Failed to fetch data');
      }
      setSummaryData(response.data.data);
    };

    if (visitId) {
      loadData();
    }
  }, [visitId]);

  if (!summaryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading medical data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <DynamicAnalysis summary={summaryData} />
      </div>
    </div>
  );
};

export default PatientAnalysis;