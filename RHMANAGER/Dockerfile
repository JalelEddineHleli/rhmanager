# Étape 1 : Compilation avec Maven
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape 2 : Exécution avec JRE léger
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8091
CMD ["sh", "-c", "ls -lh /app && java -jar app.jar"]
