import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#743cd3", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#E0F2FE"];

function SegmentationDashboard() {
  const [socioDemo, setSocioDemo] = useState({});
  const [comportementale, setComportementale] = useState({});
  const [rfm, setRfm] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSocio, resComp, resRfm] = await Promise.all([
          axios.get("http://localhost:8090/clients/sociodemographique"),
          axios.get("http://localhost:8090/clients/comportementale"),
          axios.get("http://localhost:8090/clients/rfm"),
        ]);
        setSocioDemo(resSocio.data);
        setComportementale(resComp.data);
        setRfm(resRfm.data);
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

  // Transformer sociodemo en data pour le PieChart
  const socioData = Object.entries(socioDemo).map(([tranche, sexes]) => {
    // sexes est du style { "M": [..], "F": [..] }
    const totalClients = Object.values(sexes).reduce(
        (acc, arr) => acc + arr.length,
        0
    );

    return {
      name: tranche,
      value: totalClients,
    };
  });
  return (
      <div className="p-6 space-y-10">

        {/* SOCIODEMOGRAPHIQUE */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Sociodemographic Segmentation</h2>
          <div className="w-full h-96">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                    data={socioData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                >
                  {socioData.map((entry, index) => (
                      <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                      />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>


      </div>
  );
}

export default SegmentationDashboard;
