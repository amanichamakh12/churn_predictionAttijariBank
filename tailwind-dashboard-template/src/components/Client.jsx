import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../partials/PageLayout.jsx";

function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtres
    const [genderFilter, setGenderFilter] = useState("all");
    const [segFilter, setSegFilter] = useState("all");
    const [minSeniority, setMinSeniority] = useState("");
    const [searchId, setSearchId] = useState("");

    // Modal & historique
    const [selectedClient, setSelectedClient] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loadingPredictions, setLoadingPredictions] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8090/clients/all")
            .then(res => {
                setClients(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const fetchPredictions = (clientId) => {
        setLoadingPredictions(true);
        axios.get(`http://localhost:8090/predictions/historique-predictions/${clientId}`)
            .then(res => {
                setPredictions(res.data);
                setLoadingPredictions(false);
                console.log(res.data)
            })
            .catch(err => {
                console.error(err);
                setPredictions([]);
                setLoadingPredictions(false);
            });
    };

    if (loading) return <p>Chargement des clients...</p>;
    if (error) return <p>Erreur: {error.message}</p>;

    // Appliquer les filtres
    const filteredClients = clients.filter(client => {
        const genderMatch =
            genderFilter === "all" ||
            (genderFilter === "M" && client.SEXT === "M") ||
            (genderFilter === "F" && client.SEXT === "F");

        const segMatch = segFilter === "all" || client.SEG === parseInt(segFilter);

        const seniorityMatch =
            minSeniority === "" ||
            Math.floor(client.anciennete / 12) >= parseInt(minSeniority);

        const searchMatch =
            searchId === "" ||
            client.CLI_id.toString().toLowerCase().includes(searchId.toLowerCase());

        return genderMatch && segMatch && seniorityMatch && searchMatch;
    });

    return (
        <PageLayout title="Clients list">
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                {/* Filtres */}
                <div style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    background: "#f9f9f9",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                }}>
                    <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
                            style={{ padding: "8px", borderRadius: "5px" }}>
                        <option value="all">Tous genres</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>

                    <select value={segFilter} onChange={e => setSegFilter(e.target.value)}
                            style={{ padding: "8px", borderRadius: "5px" }}>
                        <option value="all">Tous groupes</option>
                        <option value="60">60</option>
                        <option value="61">61</option>
                        <option value="62">62</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Ancienneté min (ans)"
                        value={minSeniority}
                        onChange={e => setMinSeniority(e.target.value)}
                        style={{ width: "180px", padding: "8px", borderRadius: "5px" }}
                    />

                    <input
                        type="text"
                        placeholder="Rechercher par ID"
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                        style={{ padding: "8px", borderRadius: "5px" }}
                    />
                </div>

                {/* Tableau */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                    }}>
                        <thead>
                        <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
                            <th style={{ padding: "12px", textAlign: "left" }}>Client id</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Gender</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Child number</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Client group</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Age</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Nb Transactions</th>
                            <th style={{ padding: "12px", textAlign: "right" }}>Total amount</th>
                            <th style={{ padding: "12px", textAlign: "right" }}>Last amount</th>
                            <th style={{ padding: "12px", textAlign: "center" }}>Seniority</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredClients.map((client, index) => (
                            <tr key={client.CLI_id}
                                style={{
                                    backgroundColor: index % 2 === 0 ? "#fff" : "#f7faff",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    setSelectedClient(client);
                                    fetchPredictions(client.CLI_id);
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#eaf3ff"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f7faff"}
                            >
                                <td style={{ padding: "10px" }}>{client.CLI_id}</td>
                                <td style={{ padding: "10px" }}>
                                    {client.SEXT === "M" ? "Male" : client.SEXT === "F" ? "Female" : client.SEXT}
                                </td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{client.NBENF}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{client.SEG}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{client.age}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{client.nb_transactions}</td>
                                <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                                    {client.montant_total.toLocaleString()} dt
                                </td>
                                <td style={{ padding: "10px", textAlign: "right" }}>
                                    {client.dernier_montant.toLocaleString()} dt
                                </td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    <span style={{
                                        backgroundColor: "#007BFF",
                                        color: "white",
                                        padding: "4px 10px",
                                        borderRadius: "15px",
                                        fontSize: "12px"
                                    }}>
                                        {Math.floor(client.anciennete / 12)} ans {client.anciennete % 12} mois
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal historique */}
                {selectedClient && (
                    <div style={{
                        position: "fixed",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                         onClick={() => setSelectedClient(null)}>
                        <div style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto"
                        }}
                             onClick={(e) => e.stopPropagation()}>
                            <h2>Prediction history - Client {selectedClient.CLI_id}</h2>
                            {loadingPredictions ? (
                                <p>Chargement...</p>
                            ) : predictions.length === 0 ? (
                                <p>Aucune prédiction trouvée.</p>
                            ) : (
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    marginTop: "15px"
                                }}>
                                    <thead>
                                    <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
                                        <th style={{ padding: "8px" }}>Date</th>
                                        <th style={{ padding: "8px" }}>Result</th>
                                        <th style={{ padding: "8px" }}>Score</th>
                                        <th style={{ padding: "8px" }}>Reason</th>
                                        <th style={{ padding: "8px" }}>Recommandation</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {predictions.map((p, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                                            <td style={{ padding: "8px" }}> {new Date(item.datePrediction).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}</td>

                                            <td style={{ padding: "8px" }}>{p.churnPred}</td>
                                            <td style={{ padding: "8px" }}>{p.churnProb}</td>
                                            <td style={{ padding: "8px" }}>{p.reason}</td>
                                            <td style={{ padding: "8px" }}>{p.recommandation}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                            <button onClick={() => setSelectedClient(null)}
                                    style={{ marginTop: "15px", padding: "8px 12px", border: "none", borderRadius: "5px", background: "#007BFF", color: "white", cursor: "pointer" }}>
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export default ClientList;
