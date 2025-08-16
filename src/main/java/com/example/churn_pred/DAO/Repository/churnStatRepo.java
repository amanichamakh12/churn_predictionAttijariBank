package com.example.churn_pred.DAO.Repository;


import com.example.churn_pred.DAO.Entity.ChurnStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface churnStatRepo extends JpaRepository<ChurnStat, Long> {
    List<ChurnStat> findByDateBetweenOrderByDateAsc(LocalDate start, LocalDate end);
}

