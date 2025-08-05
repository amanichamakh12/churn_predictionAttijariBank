# churn_predictionAttijariBank la partie Back and front

🚀 Lancer le projet
✅ Prérequis
JDK 17 ou + installé
Maven installé (mvn -v)
PostgreSQL 

✅Commande pour exécuter
mvn spring-boot:run

🌐 Endpoints principaux
📥 /clients/save
→ Enregistrer un nouveau client (appelé par le service ML)

📤 /clients/receive-csv
→ Enregistrer une liste de clients depuis un fichier CSV

📊 /predictions/predict
→ Enregistrer une prédiction individuelle depuis FastAPI

📦 /predictions/predict-batch
→ Envoyer un fichier CSV vers FastAPI, recevoir et stocker les prédictions

📜 /predictions/predictionList
→ Afficher l’historique des prédictions d’un client donné

🔁 Communication avec FastAPI
Le backend envoie les données brutes ou traitées à une API FastAPI externe, qui :

Prétraite les données (churn_data_processing.py)

Effectue la prédiction

Retourne les résultats au backend qui les enregistre dans la base de données
🔁Exemple de JSON body recue:
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


✅ Exemple de scenario de test avec postman
Tu uploades un CSV dans http://localhost:8090/predictions/predict-batch (post request)

Le backend envoie ce fichier à FastAPI dans http://127.0.0.1:8000/process-csv ==>FastAPI prétraite + prédit

Les résultats sont retournés au backend

Le backend :

Enregistre chaque client s’il est nouveau

Sauvegarde chaque prédiction

Tu consultes /predictionList pour voir l’historique


