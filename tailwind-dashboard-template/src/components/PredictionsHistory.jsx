import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../partials/PageLayout.jsx";

function PredictionsHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);

    // Filtres
    const [filterChurn, setFilterChurn] = useState(""); // "CHURN", "NON-CHURN" ou ""
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8090/predictions/all")
            .then(res => setHistory(res.data))
            .catch(() => setError("Erreur lors du chargement des prédictions"))
            .finally(() => setLoading(false));
    }, []);

    // Filtrage combiné
    const filteredHistory = history.filter(item => {
        // Filtre churn
        const matchesChurn = filterChurn === "" || item.churnPred === filterChurn;

        // Filtre texte (ID prédiction)
        const matchesText = filterText === "" || item.idPred.toLowerCase().includes(filterText.toLowerCase());

        // Filtre dates
        const itemDate = new Date(item.datePrediction);
        const matchesStartDate = !filterStartDate || itemDate >= new Date(filterStartDate);
        const matchesEndDate = !filterEndDate || itemDate <= new Date(filterEndDate);

        return matchesChurn && matchesText && matchesStartDate && matchesEndDate;
    });

    return (
        <PageLayout title="Historique des Prédictions">
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Historique des Prédictions</h1>

                {/* Barre de filtres */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Recherche ID prédiction..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={filterChurn}
                        onChange={e => setFilterChurn(e.target.value)}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous</option>
                        <option value="CHURN">Churn</option>
                        <option value="NON-CHURN">Non-Churn</option>
                    </select>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={e => setFilterStartDate(e.target.value)}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={e => setFilterEndDate(e.target.value)}
                        className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Affichage loading / erreur */}
                {loading && <p className="text-center py-6">Chargement...</p>}
                {error && <p className="text-center py-6 text-red-500">{error}</p>}

                {/* Tableau */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-lg">
                            <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="py-3 px-4 text-left">Prediction ID</th>
                                <th className="py-3 px-4 text-left">Result</th>
                                <th className="py-3 px-4 text-left">Score</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map(item => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-100 border-b transition duration-200"
                                    >
                                        <td className="py-3 px-4">{item.idPred}</td>
                                        <td className={`py-3 px-4 font-semibold ${item.churnPred === "CHURN" ? "text-red-600" : "text-green-600"}`}>
                                            {item.churnPred}
                                        </td>
                                        <td className="py-3 px-4">{(item.churnProb * 100).toFixed(1)}%</td>
                                        <td className="py-3 px-4">
                                            {new Date(item.datePrediction).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => setSelectedPrediction(item)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                                            >
                                                Voir détails
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                                        Aucun historique trouvé
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal détails */}
                {selectedPrediction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">
                                Détails Client {selectedPrediction.clientId || selectedPrediction.idPred}
                            </h2>
                            <p><strong>Prédiction :</strong> {selectedPrediction.churnPred}</p>
                            <p><strong>Score :</strong> {(selectedPrediction.churnProb * 100).toFixed(1)}%</p>
                            <p><strong>Date :</strong> {new Date(selectedPrediction.datePrediction).toLocaleString("fr-FR")}</p>
                            <button
                                onClick={() => setSelectedPrediction(null)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default PredictionsHistory;
