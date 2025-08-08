import React, { useState } from "react";
import PageLayout from "../partials/PageLayout.jsx";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import  axios from "axios"
function BatchPredictionPage() {
    const [file, setFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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
            console.log(res)
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi !");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <PageLayout title="Batch prediction">
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
            {predictionResult && (
                <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Résultats</h2>
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Client Id</th>
                            <th className="py-2 px-4 border-b">Prediction</th>
                            <th className="py-2 px-4 border-b">Percentage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {predictionResult.predictions.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                                <td className="py-2 px-4 border-b">{item.CLI_id}</td>
                                <td className="py-2 px-4 border-b">{item.prediction}</td>
                                <td className="py-2 px-4 border-b">{(item.probabilite * 100).toFixed(2)} %</td>
                            </tr>
                        ))}
                        </tbody>


                    </table>
                </div>
            )}

        </PageLayout>
    );
}

export default BatchPredictionPage;
