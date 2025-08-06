package com.example.churn_pred.Service.clientService;

import com.example.churn_pred.DAO.DTO.PredictionRequest;
import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Repository.clientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class clientService implements IclientService {
    @Autowired
    private clientRepo cr;


    @Override
    public Client enregistrerClient(PredictionRequest predRequest) {
        Client newclient = predRequest.getClient();

        // Étape 1 : log des infos reçues
        System.out.println("📥 Données reçues du client : " + newclient);

        Optional<Client> existingClientOpt = cr.findByCli(newclient.getCli());

        if (existingClientOpt.isPresent()) {
            System.out.println("✅ Client existe déjà avec le CLI : " + newclient.getCli());

            // Étape 2 : log avant mise à jour
            System.out.println("🔄 Mise à jour du client existant...");

            updateClient(newclient);

            System.out.println("✅ Mise à jour terminée.");
            return existingClientOpt.get();
        } else {
            System.out.println("🆕 Nouveau client détecté. Enregistrement en cours...");

            // Étape 3 : log des champs à sauvegarder
            System.out.println("🎯 Champs du nouveau client à sauvegarder :");
            System.out.println(" - Age : " + newclient.getAge());
            System.out.println(" - Ancienneté : " + newclient.getAnciennete());
            System.out.println(" - Dernier montant : " + newclient.getDernier_montant());
            System.out.println(" - CLI : " + newclient.getCli());

            Client savedClient = cr.save(newclient);

            System.out.println("✅ Client enregistré avec ID : " + savedClient.getCli());
            return savedClient;
        }
    }


    public String updateClient(Client newClientData) {

        Optional<Client> existingClientOpt = cr.findByCli(newClientData.getCli());

        if (existingClientOpt.isPresent()) {
            Client existingClient = existingClientOpt.get();
            existingClient.setAge(newClientData.getAge());
            existingClient.setAnciennete(newClientData.getAnciennete());
            existingClient.setDernier_montant(newClientData.getDernier_montant());
            existingClient.setMontant_min(newClientData.getMontant_min());
            existingClient.setMontant_max(newClientData.getMontant_max());
            existingClient.setNbenf(newClientData.getNbenf());
            existingClient.setSeg(newClientData.getSeg());
            existingClient.setSext(newClientData.getSext());
            existingClient.setMontant_moyen(newClientData.getMontant_moyen());
            existingClient.setMontant_total(newClientData.getMontant_total());
            existingClient.setNb_libelles_produits(newClientData.getNb_libelles_produits());
            existingClient.setNb_types_produits(newClientData.getNb_types_produits());
            existingClient.setNb_transactions(newClientData.getNb_transactions());

            cr.save(existingClient);
            System.out.println("Client mis à jour avec succès : " + existingClient.getCli());
        } else {
            cr.save(newClientData);
        }
        return "Client sauvegardé ou mis à jour";
    }


    public String saveClientsFromCsv(MultipartFile file) {
        List<Client> clients = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] parts = line.split(",");
                if (parts.length < 14) {
                    continue; // ligne invalide
                }
                Client client = new Client();
                client.setCli(Long.parseLong(parts[0].trim()));
                client.setSext(parts[1].trim());
                client.setNbenf(Float.parseFloat(parts[2].trim()));
                client.setSeg(Float.parseFloat(parts[3].trim()));
                client.setNb_transactions(Integer.parseInt(parts[4].trim()));
                client.setMontant_total(Double.parseDouble(parts[5].trim()));
                client.setMontant_moyen(Double.parseDouble(parts[6].trim()));
                client.setMontant_max(Double.parseDouble(parts[7].trim()));
                client.setMontant_min(Double.parseDouble(parts[8].trim()));
                client.setDernier_type_op((parts[9].trim()));
                client.setDernier_montant(Double.valueOf((parts[10].trim())));
                client.setNb_types_produits(Integer.parseInt(parts[11].trim()));
                client.setNb_libelles_produits(Integer.parseInt(parts[12].trim()));
                client.setAge(Integer.parseInt(parts[13].trim()));
                client.setAnciennete(Integer.parseInt(parts[14].trim()));

                clients.add(client);
            }

            cr.saveAll(clients);
            return "✅ " + clients.size() + " clients enregistrés avec succès.";

        } catch (IOException e) {
            return "Erreur lecture fichier : " + e.getMessage();

        }
    }


    }




