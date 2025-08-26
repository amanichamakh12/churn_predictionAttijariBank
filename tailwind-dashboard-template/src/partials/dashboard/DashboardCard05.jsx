import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA"];

function DashboardCard05() {
    const [comportementale, setComportementale] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resComp = await axios.get("http://localhost:8090/clients/comportementale");
                setComportementale(resComp.data);
            } catch (err) {
                setError("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p className="text-center py-6">Chargement...</p>;
    if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

    const compData = Object.entries(comportementale).map(([segment, clients]) => ({
        segment,
        clients: clients.length
    }));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Behavioral Segmentation</h2>
            <div className="w-full h-96">
                <ResponsiveContainer>
                    <BarChart data={compData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segment" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="clients" fill={COLORS[0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DashboardCard05;
