package com.example.churn_pred.Service.predService;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import com.example.churn_pred.DAO.Repository.predRepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class predictionService {
private final predRepo pr;

    public predictionService(predRepo pr) {
        this.pr = pr;
    }

    public List<Prediction> getPredByUser(Client client) {

        return pr.findPredictionByClient(client);
    }

    public List<Client> getClientsARisque() {
        return pr.findAll().stream()
                .filter(p -> p.getChurnProb() > 0.5)
                .map(Prediction::getClient)
                .distinct() // pour éviter les doublons
                .collect(Collectors.toList());

    }
    public List<Prediction> getHistorique(Client client) {
        return pr.findPredictionByClient(client);
    }
}
