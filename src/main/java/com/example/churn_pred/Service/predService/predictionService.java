package com.example.churn_pred.Service.predService;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import com.example.churn_pred.DAO.Repository.predRepo;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class predictionService {
private final predRepo pr;

    public predictionService(predRepo pr) {
        this.pr = pr;
    }

    public List<Prediction> getPredByUser(Client client) {

        return pr.findPredictionByClient(client);
    }
}
