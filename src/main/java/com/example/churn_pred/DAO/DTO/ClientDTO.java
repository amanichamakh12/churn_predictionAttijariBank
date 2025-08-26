package com.example.churn_pred.DAO.DTO;

public record ClientDTO(
        Long cli,
        String sext,
        Float nbenf,
        Float seg,
        Integer nb_transactions,
        Double montant_total,
        Double montant_moyen,
        Double montant_max,
        Double montant_min,
        String dernier_type_op,
        Double dernier_montant,
        Integer nb_types_produits,
        Integer nb_libelles_produits,
        Integer age,
        Integer anciennete
) {}