# churn_predictionAttijariBank



🚀 Comment lancer le projet
1. Lancer l’API FastAPI :
uvicorn main:app --reload
2. Lancer le backend Spring Boot :
Depuis IntelliJ ou ligne de commande :
./mvnw spring-boot:run
3. Tester l’API de prédiction batch :
Méthode POST → /predictions/predict-batch
Paramètre : file (CSV non prétraité)
FastAPI traite le CSV, retourne les prédictions, et Spring les enregistre en base.
