import React, { useEffect, useState } from 'react';
import DynamicAnalysis from './DynamicAnalysis';

const PatientAnalysis = () => {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Import the JSON data
        const response = await import('../../../../demo response/summary.json');
        setSummaryData(response.default);
      } catch (error) {
        console.error('Error loading summary data:', error);
      }
    };

    loadData();
  }, []);

  if (!summaryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading medical data...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <DynamicAnalysis summary={summaryData} />
      </div>
    </div>
  );
};

export default PatientAnalysis;