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
    public void enregistrerClient(PredictionRequest predRequest) {
        Client newclient = predRequest.getClient();
        Client cl = new Client();
        cl.setAge(newclient.getAge());
        cl.setAnciennete(newclient.getAnciennete());
        cl.setCli(newclient.getCli());
        cl.setDernier_montant(newclient.getDernier_montant());
        cl.setMontant_min(newclient.getMontant_min());
        cl.setMontant_max(newclient.getMontant_max());
        cl.setNbenf(newclient.getNbenf());
        cl.setSeg(newclient.getSeg());
        cl.setSext(newclient.getSext());
        cl.setMontant_moyen(newclient.getMontant_moyen());
        cl.setMontant_total(newclient.getMontant_total());
        cl.setNb_libelles_produits(newclient.getNb_libelles_produits());
        cl.setNb_types_produits(newclient.getNb_types_produits());
        cl.setNb_transactions(newclient.getNb_transactions());
        cr.save(cl);
    }

    public void updateClient(Client newClientData) {
        Optional<Client> existingClientOpt = cr.findByCli(newClientData.getCli());

        if (existingClientOpt.isPresent()) {
            Client existingClient = existingClientOpt.get();

            // Mise à jour des champs
            existingClient.setCli(newClientData.getCli());
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
        } else {
            cr.save(newClientData);
        }
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




