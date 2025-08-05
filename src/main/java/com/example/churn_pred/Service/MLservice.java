package com.example.churn_pred.Service;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
@Service
public class MLservice {
    private final RestTemplate restTemplate;

    public MLservice(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public Prediction getPrediction(Client client) {
        String url = "http://localhost:8000/predict";

        Map<String, Object> request = new HashMap<>();
//        request.put("age", client.getAge());
//        request.put("sexe", client.getSext());
//        request.put("transactions", client.getNbTransactions());
//        request.put("montant", client.getMontantMoyen());

        ResponseEntity<Prediction> response = restTemplate
                .postForEntity(url, request, Prediction.class);

        return response.getBody();
    }

}
