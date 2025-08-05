package com.example.churn_pred.DAO.DTO;

import com.example.churn_pred.DAO.Entity.Client;

public class PredictionRequest {
    private Client client;
    private double probability;
    private String predictionValue;
    private String reason;

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }

    public String getPredictionValue() {
        return predictionValue;
    }

    public void setPredictionValue(String predictionValue) {
        this.predictionValue = predictionValue;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}


