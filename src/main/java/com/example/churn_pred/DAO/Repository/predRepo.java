package com.example.churn_pred.DAO.Repository;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface predRepo extends JpaRepository<Prediction,Long> {
    @Query("SELECT COUNT(*) FROM Prediction ")
    long countAll();

    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.churnPred = 'CHURN'")
    long countChurn();

    List<Prediction> findPredictionByClient(Client client);
}
