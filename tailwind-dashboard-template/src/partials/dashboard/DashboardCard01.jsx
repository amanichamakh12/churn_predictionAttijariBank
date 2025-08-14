import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from '../../charts/BarChart01.jsx'; // ton composant Chart.js

function PredictionsSummaryCard() {
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
          // si tu as besoin d'envoyer des params (ex: startDate) tu peux les ajouter ici
          // params: { startDate: '2025-08-01T00:00:00' }
        });

        const data = resp.data;
        setSummary(data);

        // Si l'API renvoie déjà churnVsNonChurn: { churn: n, nonChurn: m }
        if (data.churnVsNonChurn) {
          setChartData({
            labels: data.churnVsNonChurn.labels || ["Churn", "Non-Churn"],
            datasets: [
              {
                label: "Churn",
                data: [data.churnVsNonChurn.churn ?? data.churnCount ?? 0],
                backgroundColor: getCssColor('--color-red-500') || '#ff4d4f',
                hoverBackgroundColor: getCssColor('--color-red-600') || '#d9363e',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
              {
                label: "Non-Churn",
                data: [data.churnVsNonChurn.nonChurn ?? (data.totalClients - (data.churnCount ?? 0)) ?? 0],
                backgroundColor: getCssColor('--color-green-500') || '#52c41a',
                hoverBackgroundColor: getCssColor('--color-green-600') || '#389e0d',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
            ],
          });
        } else if (data.churnEvolution) {
          // Si l'API renvoie une série temporelle churnEvolution: [{date, rate}, ...]
          const labels = data.churnEvolution.map(item => item.date);
          const churnCounts = data.churnEvolution.map(item => item.churn ?? Math.round((item.rate ?? 0) * (data.totalClients ?? 1)));
          const nonChurnCounts = data.churnEvolution.map((item, idx) => (data.totalClientsForEachDay ? data.totalClientsForEachDay[idx] - churnCounts[idx] : 0));

          setChartData({
            labels,
            datasets: [
              {
                label: "Churn",
                data: churnCounts,
                backgroundColor: getCssColor('--color-red-500') || '#ff4d4f',
                hoverBackgroundColor: getCssColor('--color-red-600') || '#d9363e',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
              {
                label: "Non-Churn",
                data: nonChurnCounts,
                backgroundColor: getCssColor('--color-green-500') || '#52c41a',
                hoverBackgroundColor: getCssColor('--color-green-600') || '#389e0d',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
            ],
          });
        } else {
          // fallback: simple summary bar with churn vs non-churn
          const churn = data.churnCount ?? Math.round((data.globalChurnRate ?? 0) * (data.totalClients ?? 0));
          const nonChurn = (data.totalClients ?? 0) - churn;
          setChartData({
            labels: ["This month"],
            datasets: [
              {
                label: "Churn",
                data: [churn],
                backgroundColor: getCssColor('--color-red-500') || '#ff4d4f',
                hoverBackgroundColor: getCssColor('--color-red-600') || '#d9363e',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
              {
                label: "Non-Churn",
                data: [nonChurn],
                backgroundColor: getCssColor('--color-green-500') || '#52c41a',
                hoverBackgroundColor: getCssColor('--color-green-600') || '#389e0d',
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderRadius: 4,
              },
            ],
          });
        }

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

  // utilitaire local pour récupérer la variable CSS (ton projet a getCssVariable; si non, adapte)
  function getCssColor(varName) {
    try {
      return getComputedStyle(document.documentElement).getPropertyValue(varName)?.trim() || null;
    } catch (e) {
      return null;
    }
  }

  return (
      <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Résumé des prédictions</h2>
        </header>

        <div className="p-4">
          {loading && <div>Chargement des données...</div>}
          {error && <div className="text-red-500">Erreur : {error}</div>}

          {!loading && !error && summary && (
              <>
                <div className="mb-4">
                  <p>Taux global de churn : <strong
                      style={{color: '#ff4d4f'}}>{((summary.globalChurnRate ?? 0) * 100).toFixed(2)}%</strong></p>
                  <p>Total clients analysés : <strong>{summary.totalClients ?? '-'}</strong></p>
                  <p>Clients churn (prévu) : <strong>{summary.churnCount ?? '-'}</strong></p>
                </div>

                <div style={{width: "100%", height: 260}}>
                  {chartData ? (
                      <BarChart data={{
                        labels: chartData.labels,
                        datasets: chartData.datasets
                      }} width={595} height={248}/>
                  ) : (
                      <div>Aucune donnée graphique disponible</div>
                  )}
                </div>
              </>
          )}
        </div>
      </div>
  );
}

export default PredictionsSummaryCard;
