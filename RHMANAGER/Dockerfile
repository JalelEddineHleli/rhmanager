# Utilise une image Java 21 légère basée sur Alpine
FROM eclipse-temurin:21-jdk-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier le projet dans l'image
COPY . .

# Rendre le wrapper Maven exécutable
RUN chmod +x mvnw

# Compiler le projet sans lancer les tests
RUN ./mvnw clean package -DskipTests

# Trouver automatiquement le fichier .jar et l'exécuter
CMD ["sh", "-c", "java -jar target/*.jar"]
