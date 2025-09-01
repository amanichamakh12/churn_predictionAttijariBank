import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

const COLORS = ["#3B82F6FF", "#60A5FA", "#10B981", "#F59E0B", "#EF4444"];

function DashboardCard05() {
    const [behavioralData, setBehavioralData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8090/clients/comportementale");
                setBehavioralData(res.data);
            } catch (err) {
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p className="text-center py-6 text-gray-700 dark:text-gray-300">Loading...</p>;
    if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

    const barData = Object.entries(behavioralData).map(([segment, clients]) => ({
        segment,
        clients: clients.length
    }));

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Behavioral Segmentation
            </h2>
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={barData}
                        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                        <XAxis type="number" tick={{ fill: '#1f3d91', fontWeight: 'bold' }} />
                        <YAxis type="category" dataKey="segment" tick={{ fill: '#1E3A8A', fontWeight: 'bold' }} />
                        <Tooltip formatter={(value) => [`${value}`, "Clients"]} />
                        <Bar dataKey="clients" fill={COLORS[0]} radius={[10, 10, 10, 10]}>
                            <LabelList dataKey="clients" position="right" fill="#1E3A8A" fontWeight="bold" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DashboardCard05;
