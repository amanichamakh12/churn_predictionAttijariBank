import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChurnPieChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8090/predictions/summary')
        .then((res) => {
          const data = res.data;

          const churn = data.churnCount ?? 0;
          const nonChurn = data.nonChurnCount ?? 0;

          setChartData({
            labels: ['Churn', 'Non Churn'],
            datasets: [
              {
                data: [churn, nonChurn],
                backgroundColor: ['#3B82F6', '#93C5FD'], // Bleu foncé / bleu clair
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
              },
            ],
          });

          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Erreur de récupération');
          setLoading(false);
        });
  }, []);

  return (
      <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Répartition Churn / Non Churn
          </h2>
        </header>
        <div className="p-6 flex justify-center">
          {loading && <div>Chargement...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && chartData && (
              <div style={{ width: '180px', height: '180px' }}>
                <Doughnut
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#374151', // gris foncé lisible
                          },
                        },
                      },
                    }}
                />
              </div>
          )}
        </div>
      </div>
  );
}

export default ChurnPieChart;
