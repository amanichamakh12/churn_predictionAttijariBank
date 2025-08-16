import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "../../charts/BarChart01.jsx";

function DashboardCard01() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const resp = await axios.get("http://localhost:8090/predictions/summary", {
          cancelToken: source.token,
        });

        const data = resp.data;
        setSummary(data);
        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
          setError(err.message || "Erreur de récupération");
          setLoading(false);
        }
      }
    }

    fetchSummary();
    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  return (
      <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Churn rate
          </h2>
        </header>

        <div className="p-6">
          {loading && <div>Chargement des données...</div>}
          {error && <div className="text-red-500">Erreur : {error}</div>}

          {!loading && !error && summary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Bloc 1 - Churn rate */}

                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {((summary.globalChurnRate ?? 0)).toFixed(2)}%
                  </p>
              </div>
          )}
        </div>
      </div>
  );
}

export default DashboardCard01;
