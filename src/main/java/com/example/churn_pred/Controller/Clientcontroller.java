package com.example.churn_pred.Controller;

import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Repository.clientRepo;
import com.example.churn_pred.Service.clientService.clientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("clients")
@CrossOrigin(origins = "*")
public class Clientcontroller {
    private final clientRepo clientRepository;
    private final clientService clientservice;

    public Clientcontroller(clientRepo clientRepository, clientService clientservice) {
        this.clientRepository = clientRepository;
        this.clientservice = clientservice;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveClient(@RequestBody Client newclient) {
        if (newclient.getCli() == null) {  // ou getCli() selon votre choix
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "L'ID client doit être fourni"
            );
        }
        Client cl=new Client();
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
        clientRepository.save(cl);

        return ResponseEntity.ok("Client reçu avec succès !");
    }
    @PostMapping("/receive-csv")
    public ResponseEntity<String> receiveCsv(@RequestParam("file") MultipartFile file) {
        try {
            // Lire le contenu ou le sauvegarder
            String originalFilename = file.getOriginalFilename();
            Path path = Paths.get("uploads/" + originalFilename);
            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());
            clientservice.saveClientsFromCsv(file);

            return ResponseEntity.ok("Fichier traité et clients enregistrés avec succès !");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du traitement du fichier.");
        }}

    @GetMapping("/sociodemographique")
    public Map<String, List<Client>> segmentSocioDemographique() {
        List<Client> clients = clientRepository.findAll();

        return clients.stream()
                .collect(Collectors.groupingBy(client -> {
                    String trancheAge;
                    if (client.getAge() < 26) trancheAge = "18-25 ans";
                    else if (client.getAge() < 36) trancheAge = "26-35 ans";
                    else if (client.getAge() < 51) trancheAge = "36-50 ans";
                    else trancheAge = "51+ ans";

                    return client.getSext() + " - " + trancheAge;
                }));
    }

    @GetMapping("/comportementale")
    public Map<String, List<Client>> segmentComportementale() {
        List<Client> clients = clientRepository.findAll();

        return clients.stream()
                .collect(Collectors.groupingBy(client -> {
                    if (client.getNb_transactions() < 5) return "Occasionnels";
                    else if (client.getNb_transactions() < 15) return "Réguliers";
                    else return "Très actifs";
                }));
    }
//recence frequence et montant
    @GetMapping("/rfm")
    public List<Map<String, Object>> segmentationRFM() {
        List<Client> clients = clientRepository.findAll();
        List<Map<String, Object>> rfmScores = new ArrayList<>();

        for (Client c : clients) {
            int recenceScore = (c.getDernier_montant() > 0) ? 5 : 1;
            int frequenceScore = (c.getNb_transactions() > 15) ? 5 : (c.getNb_transactions() > 5 ? 3 : 1);
            int montantScore = (c.getMontant_total() > 5000) ? 5 : (c.getMontant_total() > 1000 ? 3 : 1);

            Map<String, Object> clientScore = new HashMap<>();
            clientScore.put("CLI_id", c.getCli());
            clientScore.put("Recence", recenceScore);// combien de temps le client a realisé sa derniere transaction
            clientScore.put("Frequence", frequenceScore);// score de frequence de transactions
            clientScore.put("Montant", montantScore);//
            clientScore.put("ScoreTotal", recenceScore + frequenceScore + montantScore);

            rfmScores.add(clientScore);
        }

        return rfmScores;
    }


    @GetMapping("/all")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }




}
