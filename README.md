# churn_predictionAttijariBank



🚀 Comment lancer le projet
1. Lancer l’API FastAPI :
Uvicorn churn_api:app --reload
2. Lancer le backend Spring Boot :
Depuis IntelliJ ou ligne de commande :
./mvnw spring-boot:run
3. Tester les APIs fastApi depuis le backend :
test prediction 1 seule client :Methode POST --> /predictions/predict
test de prediction de plusieurs clients a partir du fichier CSV transactionnelle :
Méthode POST --> /predictions/predict-batch
Paramètre : file (CSV Transactionnelle)
FastAPI traite le CSV, retourne les prédictions, et Spring les enregistre en base.
