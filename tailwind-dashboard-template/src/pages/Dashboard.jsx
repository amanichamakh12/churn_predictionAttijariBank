import React, { useEffect, useState } from 'react';
import Sidebar from '../partials/Sidebar.jsx';
import Header from '../partials/Header.jsx';
import FilterButton from '../components/DropdownFilter.jsx';
import Datepicker from '../components/Datepicker.jsx';
import DashboardCard01 from '../partials/dashboard/DashboardCard01.jsx';
import DashboardCard02 from '../partials/dashboard/DashboardCard02.jsx';
import DashboardCard03 from '../partials/dashboard/DashboardCard03.jsx';
import DashboardCard04 from '../partials/dashboard/DashboardCard04.jsx';
import DashboardCard05 from '../partials/dashboard/DashboardCard05.jsx';
import DashboardCard06 from '../partials/dashboard/DashboardCard06.jsx';
import DashboardCard07 from '../partials/dashboard/DashboardCard07.jsx';
import DashboardCard08 from '../partials/dashboard/DashboardCard08.jsx';
import DashboardCard09 from '../partials/dashboard/DashboardCard09.jsx';
import DashboardCard10 from '../partials/dashboard/DashboardCard10.jsx';
import DashboardCard11 from '../partials/dashboard/DashboardCard11.jsx';
import DashboardCard12 from '../partials/dashboard/DashboardCard12.jsx';
import DashboardCard13 from '../partials/dashboard/DashboardCard13.jsx';
import Banner from '../partials/Banner.jsx';
import axios from 'axios';

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios
            .get('http://localhost:8090/predictions/summary', {
                cancelToken: source.token,
            })
            .then((res) => {
                setSummary(res.data);
                setLoading(false);
            })
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            source.cancel('Component unmounted');
        };
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            {/* Left: Title */}
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                                    Dashboard
                                </h1>
                            </div>

                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                <FilterButton align="right"/>
                                <Datepicker align="right"/>
                                <button
                                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                                    <svg
                                        className="fill-current shrink-0 xs:hidden"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                                    </svg>
                                    <span className="max-xs:sr-only">Add View</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Ligne avec les 3 indicateurs côte à côte */}
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Total clients */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                                            Total clients
                                        </h2>
                                    </header>
                                    <div className="p-6">
                                        {loading && <div>Chargement des données...</div>}
                                        {error && <div className="text-red-500">Erreur : {error}</div>}
                                        {!loading && !error && summary && (
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {summary.totalClients ?? '-'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Nb churn client */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                                            Nb churn client
                                        </h2>
                                    </header>
                                    <div className="p-6">
                                        {loading && <div>Chargement des données...</div>}
                                        {error && <div className="text-red-500">Erreur : {error}</div>}
                                        {!loading && !error && summary && (
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {summary.churnCount ?? "-"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Globale churn rate */}
                                <div className="flex flex-col bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                                            Globale churn rate
                                        </h2>
                                    </header>
                                    <div className="p-6">
                                        {loading && <div>Chargement des données...</div>}
                                        {error && <div className="text-red-500">Erreur : {error}</div>}
                                        {!loading && !error && summary && (
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {((summary.globalChurnRate ?? 0)).toFixed(2)}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Autres cartes */}
                            <DashboardCard04/>
                            <DashboardCard05/>
                            <DashboardCard06/>
                            <DashboardCard07/>
                            <DashboardCard08/>
                            <DashboardCard09/>
                            <DashboardCard10/>
                            <DashboardCard11/>
                            <DashboardCard12/>
                            <DashboardCard13/>
                        </div>
                    </div>
                </main>

                <Banner/>
            </div>
        </div>
    );
}

export default Dashboard;
