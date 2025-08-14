import React, { useState } from "react";
import PageLayout from "../partials/PageLayout.jsx";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function BatchPredictionPage() {
    const [file, setFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null); // ✅ Nouveau

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handlePredict = async () => {
        if (!file) return alert("Veuillez choisir un fichier.");
        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const res = await axios.post(
                "http://localhost:8000/process-csv",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percent);
                    },
                }
            );
            setPredictionResult(res.data);
            console.log(res);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi !");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <PageLayout title="Batch prediction">
            {/* Upload */}
            <div
                className="p-6 bg-white dark:bg-gray-800 rounded shadow text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-500 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <CloudArrowUpIcon className="mx-auto h-16 w-16 text-violet-500" />
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Glissez-déposez votre fichier ici ou{" "}
                    <label className="text-violet-600 cursor-pointer hover:underline">
                        cliquez pour parcourir
                        <input
                            type="file"
                            className="hidden"
                            accept=".csv, .xlsx, .xls"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                </p>
                {file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}

                <button
                    onClick={handlePredict}
                    disabled={!file || isUploading}
                    className="mt-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition disabled:opacity-50"
                >
                    Lancer l'analyse
                </button>

                {isUploading && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-violet-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Résultats */}
            {predictionResult && (
                <div className="mt-8 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Churn */}
                        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded shadow text-center">
                            <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
                                Clients à risque (CHURN)
                            </h3>
                            <p className="text-2xl font-semibold">
                                {predictionResult.predictions.filter(
                                    (c) => c.prediction === "CHURN"
                                ).length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {(
                                    (predictionResult.predictions.filter(
                                            (c) => c.prediction === "CHURN"
                                        ).length /
                                        predictionResult.predictions.length) *
                                    100
                                ).toFixed(2)}{" "}
                                %
                            </p>
                        </div>

                        {/* Non churn */}
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded shadow text-center">
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-300">
                                Clients fidèles (NON-CHURN)
                            </h3>
                            <p className="text-2xl font-semibold">
                                {predictionResult.predictions.filter(
                                    (c) => c.prediction === "NON-CHURN"
                                ).length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {(
                                    (predictionResult.predictions.filter(
                                            (c) => c.prediction === "NON-CHURN"
                                        ).length /
                                        predictionResult.predictions.length) *
                                    100
                                ).toFixed(2)}{" "}
                                %
                            </p>
                        </div>
                    </div>

                    {/* Tableau CHURN */}
                    <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4 text-red-600">
                            📉 Clients à risque (CHURN)
                        </h2>
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Client Id</th>
                                <th className="py-2 px-4 border-b">Prediction</th>
                                <th className="py-2 px-4 border-b">Percentage</th>
                            </tr>
                            </thead>
                            <tbody>
                            {predictionResult.predictions
                                .filter((item) => item.prediction === "CHURN")
                                .map((item, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => setSelectedClient(item)} // ✅ Clic pour ouvrir
                                        className="hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer"
                                    >
                                        <td className="py-2 px-4 border-b">{item.CLI_id}</td>
                                        <td className="py-2 px-4 border-b">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                                                    {item.prediction}
                                                </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {(item.probabilite * 100).toFixed(2)} %
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tableau NON-CHURN */}
                    <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4 text-green-600">
                            📈 Clients fidèles (NON-CHURN)
                        </h2>
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Client Id</th>
                                <th className="py-2 px-4 border-b">Prediction</th>
                                <th className="py-2 px-4 border-b">Percentage</th>
                            </tr>
                            </thead>
                            <tbody>
                            {predictionResult.predictions
                                .filter((item) => item.prediction === "NON-CHURN")
                                .map((item, index) => (
                                    <tr key={index} className="hover:bg-green-100 dark:hover:bg-green-900/40">
                                        <td className="py-2 px-4 border-b">{item.CLI_id}</td>
                                        <td className="py-2 px-4 border-b">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                                                    {item.prediction}
                                                </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {(item.probabilite * 100).toFixed(2)} %
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ✅ Modale détails client */}
            {selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={() => setSelectedClient(null)}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-red-600">
                            Détails du client #{selectedClient.CLI_id}
                        </h3>
                        <p>
                            <strong>Probabilité de churn :</strong>{" "}
                            {(selectedClient.probabilite * 100).toFixed(2)} %
                        </p>
                        <p className="mt-3">
                            <strong>Raisons :</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                            {selectedClient.reason
                                ?.split(",")
                                .map((r, i) => <li key={i}>{r.trim()}</li>)}
                        </ul>
                        <p className="mt-3">
                            <strong>Recommandations :</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                            {selectedClient.recommandation
                                ?.split(";")
                                .map((rec, i) => <li key={i}>{rec.trim()}</li>)}
                        </ul>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default BatchPredictionPage;
