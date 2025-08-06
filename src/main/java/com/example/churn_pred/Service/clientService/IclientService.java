package com.example.churn_pred.Service.clientService;

import com.example.churn_pred.DAO.DTO.PredictionRequest;
import com.example.churn_pred.DAO.Entity.Client;

import java.util.List;

public interface IclientService {
    Client enregistrerClient(PredictionRequest predRequest) ;

    }
