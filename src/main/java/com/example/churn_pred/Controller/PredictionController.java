package com.example.churn_pred.Controller;

import com.example.churn_pred.DAO.DTO.PredictionRequest;
import com.example.churn_pred.DAO.Entity.Client;
import com.example.churn_pred.DAO.Entity.Prediction;
import com.example.churn_pred.DAO.Repository.clientRepo;
import com.example.churn_pred.DAO.Repository.predRepo;
import com.example.churn_pred.Service.MLservice;
import com.example.churn_pred.Service.clientService.clientService;
import com.example.churn_pred.Service.predService.predictionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("predictions")
public class PredictionController {
    private final MLservice mlService;
    private final clientService clientService;
    private final clientRepo clientRepository;
    private final predRepo predictionRepository;
    private final com.example.churn_pred.Service.predService.predictionService predictionService;

    public PredictionController(MLservice mlService, com.example.churn_pred.Service.clientService.clientService clientService, clientRepo clientRepository, predRepo predictionRepository, predictionService predictionService) {
        this.mlService = mlService;
        this.clientService = clientService;
        this.clientRepository = clientRepository;
        this.predictionRepository = predictionRepository;
        this.predictionService = predictionService;
    }

    @PostMapping("/predict-batch")
    public ResponseEntity<String> predictBatch(@RequestParam("file") MultipartFile file) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            Resource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String fastApiUrl = "http://127.0.0.1:8000/process-csv";
            ResponseEntity<String> response = restTemplate.postForEntity(fastApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();

                // Parser la réponse JSON
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(responseBody);

                // Supposons que la rps fastapi contient un objet avec tab "predictions"
                JsonNode predictions = root.get("predictions");
                if (predictions != null && predictions.isArray()) {
                    for (JsonNode predictionNode : predictions) {
                        String predictionValue = predictionNode.get("prediction").asText();
                        double probability = predictionNode.get("probabilite").asDouble();
                        String causes = predictionNode.get("causes_probables").asText();
                        Long cliId = predictionNode.get("CLI_id").asLong();
                        Optional<Client> optionalClient = clientRepository.findById(cliId);
                        if (optionalClient.isPresent()) {
                            Prediction prediction = new Prediction();
                            prediction.setClient(optionalClient.get());
                            prediction.setChurnPred(predictionValue);
                            prediction.setChurnProb(probability);
                            prediction.setReason(causes);
                            prediction.setDatePrediction(LocalDateTime.now());
                            predictionRepository.save(prediction);
                        }


                    }
                }
                return ResponseEntity.ok("Prédictions enregistrées avec succès.");
            } else {
                return ResponseEntity.status(response.getStatusCode()).body("Erreur lors de l'appel à FastAPI : " + response.getBody());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur: " + e.getMessage());
        }
    }
    @PostMapping("/predict")
    public ResponseEntity<String> receivePrediction(@RequestBody PredictionRequest request) {
        clientService.updateClient(request.getClient());

        clientService.enregistrerClient(request);
        Prediction prediction = new Prediction();
        prediction.setClient(request.getClient()); // suppose que ta classe Prediction contient un champ "Client client"
        prediction.setChurnPred(request.getPredictionValue());
        prediction.setChurnProb(request.getProbability());
        prediction.setReason(request.getReason());
        prediction.setDatePrediction(LocalDateTime.now());

        predictionRepository.save(prediction);
        return ResponseEntity.ok("Prediction received and saved successfully.");
    }



    @GetMapping("/predictionList")
    public ResponseEntity<List<Prediction>> getPredictioByClient(@RequestBody Client cli){
        List<Prediction> predHistory = predictionService.getPredByUser(cli);

        return ResponseEntity.ok(predHistory);
    }



}
