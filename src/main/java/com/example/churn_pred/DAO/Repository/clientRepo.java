package com.example.churn_pred.DAO.Repository;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface clientRepo extends JpaRepository<Client,Long> {
    Optional<Client> findByCli(Long cli);
    Client findClientByPredictions(Prediction pred);

    }
