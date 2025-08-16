package com.example.churn_pred.DAO.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "t_client")

@AllArgsConstructor
@NoArgsConstructor
@Builder

@FieldDefaults(level = AccessLevel.PRIVATE)

public class Client {
    @Id
    @Column(name = "cli")
    @JsonProperty("CLI_id")
    private Long cli;

    @JsonProperty("SEXT")
    private String sext;

    @JsonProperty("NBENF")
    private float nbenf;

    @JsonProperty("SEG")
    private float seg;

    private Integer nb_transactions;
    private Double montant_total;
    private Double montant_moyen;
    private Double montant_max;
    private Double montant_min;
    private String dernier_type_op;
    private Double dernier_montant;
    private Integer nb_types_produits;
    private Integer nb_libelles_produits;
    private Integer age;
    private Integer anciennete;
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.EAGER)

    private List<Prediction> predictions;

    public Long getCli() {
        return cli;
    }

    public void setCli(Long cli) {
        this.cli = cli;
    }

    public String getSext() {
        return sext;
    }

    public void setSext(String sext) {
        this.sext = sext;
    }

    public float getNbenf() {
        return nbenf;
    }

    public void setNbenf(float nbenf) {
        this.nbenf = nbenf;
    }

    public float getSeg() {
        return seg;
    }

    public void setSeg(float seg) {
        this.seg = seg;
    }

    public Integer getNb_transactions() {
        return nb_transactions;
    }

    public void setNb_transactions(Integer nb_transactions) {
        this.nb_transactions = nb_transactions;
    }

    public Double getMontant_total() {
        return montant_total;
    }

    public void setMontant_total(Double montant_total) {
        this.montant_total = montant_total;
    }

    public Double getMontant_moyen() {
        return montant_moyen;
    }

    public void setMontant_moyen(Double montant_moyen) {
        this.montant_moyen = montant_moyen;
    }

    public Double getMontant_max() {
        return montant_max;
    }

    public void setMontant_max(Double montant_max) {
        this.montant_max = montant_max;
    }

    public Double getMontant_min() {
        return montant_min;
    }

    public void setMontant_min(Double montant_min) {
        this.montant_min = montant_min;
    }

    public String getDernier_type_op() {
        return dernier_type_op;
    }

    public void setDernier_type_op(String dernier_type_op) {
        this.dernier_type_op = dernier_type_op;
    }

    public Double getDernier_montant() {
        return dernier_montant;
    }

    public void setDernier_montant(Double dernier_montant) {
        this.dernier_montant = dernier_montant;
    }

    public Integer getNb_types_produits() {
        return nb_types_produits;
    }

    public void setNb_types_produits(Integer nb_types_produits) {
        this.nb_types_produits = nb_types_produits;
    }

    public Integer getNb_libelles_produits() {
        return nb_libelles_produits;
    }

    public void setNb_libelles_produits(Integer nb_libelles_produits) {
        this.nb_libelles_produits = nb_libelles_produits;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getAnciennete() {
        return anciennete;
    }

    public void setAnciennete(Integer anciennete) {
        this.anciennete = anciennete;
    }

    public List<Prediction> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<Prediction> predictions) {
        this.predictions = predictions;
    }
}
