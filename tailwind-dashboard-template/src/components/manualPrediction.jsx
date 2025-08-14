import { useState } from "react";
import PageLayout from "../partials/PageLayout.jsx";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from "@heroicons/react/24/solid";

function ManualPrediction() {
    const [formDataClient, setFormDataClient] = useState({
        CLI_id: "",
        NBENF: 0,
        SEG: 0,
        nb_transactions: 0,
        montant_total: 0,
        montant_moyen: 0,
        montant_max: 0,
        montant_min: 0,
        dernier_montant: 0,
        nb_types_produits: 0,
        nb_libelles_produits: 0,
        age: 0,
        anciennete: 0,
        SEXT: "M",
    });

    const [predictionResult, setPredictionResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handlePredictClient = async (e) => {
        e.preventDefault();
        if (!formDataClient.CLI_id) {
            return alert("Veuillez remplir le champ CLI_id.");
        }

        try {
            setIsUploading(true);
            setPredictionResult(null);

            const res = await axios.post(
                "http://localhost:8000/predict",
                formDataClient,
                { headers: { "Content-Type": "application/json" } }
            );
            setPredictionResult(res.data);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la prédiction !");
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormDataClient((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    return (
        <PageLayout title="Prédiction manuelle">
            <form
                onSubmit={handlePredictClient}
                className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                autoComplete="off"
                spellCheck="false"
            >
                {Object.entries(formDataClient).map(([key, val]) => {
                    if (key === "SEXT") {
                        return (
                            <div key={key}>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Sexe :
                                </label>
                                <select
                                    name={key}
                                    value={formDataClient.SEXT}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="M">Homme</option>
                                    <option value="F">Femme</option>
                                </select>
                            </div>
                        );
                    } else {
                        return (
                            <div key={key}>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {key.replace("_", " ")} :
                                </label>
                                <input
                                    type={key === "CLI_id" ? "text" : "number"}
                                    name={key}
                                    value={val}
                                    onChange={handleChange}
                                    min="0"
                                    step="any"
                                    required={key === "CLI_id"}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        );
                    }
                })}

                <div className="col-span-1 md:col-span-2">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-3 text-lg font-bold rounded-lg text-white transition ${
                            isUploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-violet-600 hover:bg-violet-700"
                        }`}
                    >
                        {isUploading ? "Prédiction en cours..." : "Lancer la prédiction"}
                    </button>
                </div>
            </form>

            {predictionResult && (
                <div className="max-w-4xl mx-auto mt-8">
                    <div
                        className={`p-6 rounded-lg shadow-lg text-white ${
                            predictionResult.prediction === "CHURN" ? "bg-red-500" : "bg-green-500"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {predictionResult.prediction === "CHURN" ? (
                                <XCircleIcon className="h-8 w-8" />
                            ) : (
                                <CheckCircleIcon className="h-8 w-8" />
                            )}
                            <h2 className="text-2xl font-bold">
                                {predictionResult.prediction} - {(predictionResult.probabilite * 100).toFixed(2)}%
                            </h2>
                        </div>

                        {predictionResult.reason && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Raisons :</h3>
                                <ul className="list-disc list-inside">
                                    {predictionResult.reason.split(",").map((r, i) => (
                                        <li key={i}>{r.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {predictionResult.recommandation && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <LightBulbIcon className="h-6 w-6" /> Recommandations :
                                </h3>
                                <ul className="list-disc list-inside">
                                    {predictionResult.recommandation.split(";").map((rec, i) => (
                                        <li key={i}>{rec.trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default ManualPrediction;
