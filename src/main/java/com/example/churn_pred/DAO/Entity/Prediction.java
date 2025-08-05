package com.example.churn_pred.DAO.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "t_pred_results")

@AllArgsConstructor
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPred;

    private LocalDateTime datePrediction;

    private double churnProb;

    private String churnPred;

    private String modelVersion;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private String commentaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client;

    public Long getIdPred() {
        return idPred;
    }

    public LocalDateTime getDatePrediction() {
        return datePrediction;
    }

    public double getChurnProb() {
        return churnProb;
    }

    public String getChurnPred() {
        return churnPred;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public String getReason() {
        return reason;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public Client getClient() {
        return client;
    }

    public void setIdPred(Long idPred) {
        this.idPred = idPred;
    }

    public void setDatePrediction(LocalDateTime datePrediction) {
        this.datePrediction = datePrediction;
    }

    public void setChurnProb(double churnProb) {
        this.churnProb = churnProb;
    }

    public void setChurnPred(String churnPred) {
        this.churnPred = churnPred;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public void setClient(Client client) {
        this.client = client;
    }
}