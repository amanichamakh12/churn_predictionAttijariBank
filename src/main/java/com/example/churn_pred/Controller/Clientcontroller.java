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
import java.util.List;

@RestController
@RequestMapping("clients")
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






}
