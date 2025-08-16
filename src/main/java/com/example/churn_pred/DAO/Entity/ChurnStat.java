package com.example.churn_pred.DAO.Entity;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "churn_stats")
public class ChurnStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Double churnRate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getChurnRate() { return churnRate; }
    public void setChurnRate(Double churnRate) { this.churnRate = churnRate; }
}

