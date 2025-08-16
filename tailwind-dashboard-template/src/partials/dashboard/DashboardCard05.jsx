import React, { useEffect, useState } from 'react';
import Tooltip from '../../components/Tooltip.jsx';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    ChartTooltip,
    Legend
);

function DashboardCard05() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Remplace par ton vrai endpoint
        axios
            .get('http://localhost:8090/predictions/churn-evolution')
            .then((res) => {
                const data = res.data;

                // Supposons que ton API renvoie :
                // [{ date: '2025-01-01', churnRate: 12 }, ... ]
                const labels = data.map((item) => item.date);
                const churnRates = data.map((item) => item.churnRate);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Taux de Churn (%)',
                            data: churnRates,
                            fill: true,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)', // bleu clair transparent
                            borderColor: '#3B82F6', // bleu
                            borderWidth: 2,
                            tension: 0.3,
                            pointRadius: 3,
                            pointBackgroundColor: '#3B82F6',
                            pointHoverRadius: 5,
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
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Évolution du Churn dans le temps
                </h2>
                <Tooltip className="ml-2">
                    <div className="text-xs text-center whitespace-nowrap">
                        Basé sur <a className="underline" href="https://www.chartjs.org/" target="_blank" rel="noreferrer">Chart.js</a>
                    </div>
                </Tooltip>
            </header>
            <div className="p-6">
                {loading && <div>Chargement...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && chartData && (
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: {
                                    ticks: { color: '#6B7280', callback: (value) => value + '%' },
                                    grid: { color: '#E5E7EB' },
                                },
                                x: {
                                    ticks: { color: '#6B7280' },
                                    grid: { color: '#F3F4F6' },
                                },
                            },
                        }}
                        height={250}
                    />
                )}
            </div>
        </div>
    );
}

export default DashboardCard05;
