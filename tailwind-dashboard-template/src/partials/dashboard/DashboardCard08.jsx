import React, { useEffect, useState } from 'react';
import LineChart from '../../charts/LineChart02.jsx';
import { getCssVariable } from '../../utils/Utils.js';
import axios from 'axios';

function DashboardCard08() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChurnData = async () => {
      try {
        const res = await axios.get('http://localhost:8090/clients/dailyChurn');
        const data = res.data;

        // Extraire les labels et datasets depuis l'API
        const labels = data.map(item => item.date);
        const churnRates = data.map(item => item.churnRate);
        const nonChurnRates = data.map(item => item.nonChurnRate);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Churn Rate (%)',
              data: churnRates,
              borderColor: getCssVariable('--color-red-500'),
              fill: false,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: getCssVariable('--color-red-500'),
              pointHoverBackgroundColor: getCssVariable('--color-red-500'),
              tension: 0.2,
            },
            {
              label: 'Non Churn Rate (%)',
              data: nonChurnRates,
              borderColor: getCssVariable('--color-green-500'),
              fill: false,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: getCssVariable('--color-green-500'),
              pointHoverBackgroundColor: getCssVariable('--color-green-500'),
              tension: 0.2,
            },
          ],
        });
      } catch (err) {
        setError(err.message || 'Erreur de récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchChurnData();
  }, []);

  return (
      <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Churn Rate Over Time
          </h2>
        </header>
        <div className="p-6">
          {loading && <div>Chargement...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && chartData && (
              <LineChart data={chartData} width={595} height={248} />
          )}
        </div>
      </div>
  );
}

export default DashboardCard08;
