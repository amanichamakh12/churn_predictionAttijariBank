# 💼 churn_predictionAttijariBank – Backend & Frontend

Ce dépôt contient la partie **Backend Spring Boot** (et Frontend ) du projet de prédiction de churn client

---

## 🚀 Lancer le projet

### ✅ Prérequis

- Java JDK 17+
- Maven (`mvn -v`)
- PostgreSQL (base de données configurée)
- react js

---

### ▶️ Exécution Backend

```bash
mvn spring-boot:run

| Méthode | Endpoint                      | Description                                           |
| ------- | ----------------------------- | ----------------------------------------------------- |
| `POST`  | `/clients/save`               | Enregistre un client (appelé par FastAPI)             |
| `POST`  | `/clients/receive-csv`        | Sauvegarde une liste de clients depuis un fichier CSV |
| `POST`  | `/predictions/predict`        | Enregistre une prédiction individuelle                |
| `POST`  | `/predictions/predict-batch`  | Upload CSV vers FastAPI, récupère les prédictions     |
| `GET`   | `/predictions/predictionList` | Récupère l'historique des prédictions d’un client     |

####🔁 Communication avec l’API FastAPI (Partie Data)
Le backend Spring communique avec l'API FastAPI via HTTP :

Upload du fichier CSV (transactions) :
POST http://127.0.0.1:8000/process-csv

⚙️ Pipeline côté FastAPI :
Nettoyage & transformation des données (churn_data_processing.py)

Prédiction pour chaque client

Retour des résultats (client + prédiction)

⚙️ Côté Backend :
Sauvegarde des nouveaux clients : /clients/save

Enregistrement de chaque prédiction : /predictions/predict

📤 Exemple de JSON reçu depuis FastAPI
json
{
  "client": {
    "CLI_id": 12345,
    "NBENF": 2,
    "SEG": 1,
    "nb_transactions": 10,
    "montant_total": 1500.0,
    "montant_moyen": 150.0,
    "montant_max": 300.0,
    "montant_min": 50.0,
    "dernier_montant": 100.0,
    "nb_types_produits": 3,
    "nb_libelles_produits": 4,
    "age": 35,
    "anciennete": 5,
    "SEXT": "F"
  },
  "predictionValue": "CHURN",
  "probability": 0.86,
  "causes_probables": "Le client effectue peu de transactions, le volume global de dépenses est faible, et la variété des produits utilisés est limitée."
}
🧪 Exemple de Scénario de Test avec Postman
🔸 Étapes de test :
POST vers :
http://localhost:8090/predictions/predict-batch
→ Upload d’un fichier .csv contenant les transactions brutes

Le backend :

Envoie le fichier à FastAPI (/process-csv)

FastAPI traite, prédit et renvoie les résultats

Backend :

Sauvegarde chaque client (/clients/save)

Enregistre chaque prédiction (/predictions/predict)

GET vers :
http://localhost:8090/predictions/predictionList?cli_id=12345
→ Pour consulter l’historique des prédictions d’un client donné
