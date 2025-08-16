package com.example.churn_pred.Service.predService;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;

import java.util.List;

public interface IpredictionService {
    public void getPredByUser(Client client);

    public List<Prediction> getHistorique(Client client);

}
