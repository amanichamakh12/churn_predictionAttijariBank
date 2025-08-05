package com.example.churn_pred.DAO.Repository;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface predRepo extends JpaRepository<Prediction,Long> {
    List<Prediction> findPredictionByClient(Client client);
}
