import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../partials/PageLayout.jsx";

function PredictionsHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);

    // Détails client depuis API
    const [clientDetails, setClientDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Filtres
    const [filterChurn, setFilterChurn] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8090/predictions/all")
            .then(res => setHistory(res.data))
            .catch(() => setError("Erreur lors du chargement des prédictions"))
            .finally(() => setLoading(false));
    }, []);

    const filteredHistory = history.filter(item => {
        const matchesChurn = filterChurn === "" || item.churnPred === filterChurn;
        const itemDate = new Date(item.datePrediction);
        const matchesStartDate = !filterStartDate || itemDate >= new Date(filterStartDate);
        let matchesEndDate = true;
        if (filterEndDate) {
            const endDate = new Date(filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            matchesEndDate = itemDate <= endDate;
        }
        return matchesChurn && matchesStartDate && matchesEndDate;
    });

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        if (sortOrder === "asc") return a.churnProb - b.churnProb;
        if (sortOrder === "desc") return b.churnProb - a.churnProb;
        return 0;
    });

    const fetchClientDetails = async (prediction) => {
        setLoadingDetails(true);
        setSelectedPrediction(prediction);
        try {
            const res = await axios.get(`http://localhost:8090/predictions/getclient/${prediction.idPred}`);
            setClientDetails(res.data);

        } catch (err) {
            setClientDetails({ error: "Erreur lors de la récupération des détails" });
        } finally {
            setLoadingDetails(false);
        }
    };

    const resetFilters = () => {
        setFilterChurn("");
        setFilterStartDate("");
        setFilterEndDate("");
        setSortOrder("");
    };

    return (
        <PageLayout title="Prediction history">

            {/* Barre de filtres modernisée avec labels */}
            <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-xl shadow-md">

                <div className="flex flex-col min-w-[150px]">
                    <label className="text-gray-600 mb-1">Status</label>
                    <select
                        value={filterChurn}
                        onChange={e => setFilterChurn(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous</option>
                        <option value="CHURN">Churn</option>
                        <option value="NON-CHURN">Non-Churn</option>
                    </select>
                </div>

                <div className="flex flex-col min-w-[150px]">
                    <label className="text-gray-600 mb-1">Start date</label>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={e => setFilterStartDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col min-w-[150px]">
                    <label className="text-gray-600 mb-1">End date</label>
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={e => setFilterEndDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col min-w-[150px]">
                    <label className="text-gray-600 mb-1">Sort by</label>
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Pas de tri</option>
                        <option value="asc">Score croissant</option>
                        <option value="desc">Score décroissant</option>
                    </select>
                </div>

                <button
                    onClick={resetFilters}
                    className="ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition mt-5 md:mt-6"
                >
                    🔄 Réinitialiser
                </button>
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
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map(item => (
                                <tr key={item.id} className="hover:bg-gray-100 border-b transition duration-200">
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
                                            onClick={() => fetchClientDetails(item)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                                        >
                                            View client
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
                    <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl">
                        {loadingDetails ? (
                            <p className="text-center">Chargement des détails...</p>
                        ) : clientDetails?.error ? (
                            <p className="text-red-500">{clientDetails.error}</p>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                                    🧑‍💼 Client #{clientDetails.cli}
                                </h2>

                                {/* Section Profil */}
                                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">📌 Profil</h3>
                                    <p><strong>Sexe :</strong> {clientDetails.sext === "M" ? "Homme" : "Femme"}</p>
                                    <p><strong>Âge :</strong> {clientDetails.age} ans</p>
                                    <p><strong>Ancienneté :</strong> {clientDetails.anciennete} mois</p>
                                    <p><strong>Nombre d’enfants :</strong> {clientDetails.nbenf}</p>
                                </div>

                                {/* Section Activité */}
                                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">💳 Activité bancaire</h3>
                                    <p><strong>Transactions :</strong> {clientDetails.nb_transactions}</p>
                                    <p><strong>Montant total :</strong> {clientDetails.montant_total.toFixed(2)} dt</p>
                                    <p><strong>Montant moyen :</strong> {clientDetails.montant_moyen.toFixed(2)} dt</p>
                                    <p><strong>Dernier montant :</strong> {clientDetails.dernier_montant?.toFixed(2) ?? "N/A"} dt</p>
                                </div>

                                {/* Section Produits */}
                                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">📦 Produits</h3>
                                    <p><strong>Types de produits :</strong> {clientDetails.nb_types_produits}</p>
                                    <p><strong>Libellés de produits :</strong> {clientDetails.nb_libelles_produits}</p>
                                </div>

                                {/* Prediction */}
                                <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-700 mb-2">🔮 Prédiction</h3>
                                    <p><strong>Raison :</strong> {selectedPrediction?.reason}</p>
                                    <p><strong>Recommandation :</strong> {selectedPrediction?.recommandation}</p>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => { setSelectedPrediction(null); setClientDetails(null); }}
                            className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

        </PageLayout>
    );
}

export default PredictionsHistory;
