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

function DashboardCard06() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8090/predictions/summary');
                const data = res.data;

                const churn = data.churnCount ?? 0;
                const nonChurn = (data.totalClients ?? 0) - churn;

                setChartData({
                    labels: ['Churn', 'Non Churn'],
                    datasets: [
                        {
                            data: [churn, nonChurn],
                            backgroundColor: ['#3B82F6', '#93C5FD'],
                            borderColor: ['#fff', '#fff'],
                            borderWidth: 2,
                        },
                    ],
                });
            } catch (err) {
                setError(err.message || 'Erreur de récupération');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Distribution Churn / Non Churn
                </h2>
            </header>
            <div className="p-6 flex justify-center items-center">
                {loading && <div>Chargement...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && chartData && (
                    <div style={{ width: '200px', height: '200px' }}>
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
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const label = context.label || '';
                                                const value = context.parsed || 0;
                                                return `${label}: ${value}`;
                                            },
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

export default DashboardCard06;
