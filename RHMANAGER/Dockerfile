
# Use Java 17 Alpine image - small and efficient
FROM eclipse-temurin:17-jdk-alpine

# Set working directory in the container
WORKDIR /app

# Copy everything from your back folder into the container's /app folder
COPY . .

# Make sure the Maven wrapper is executable (very important)
RUN chmod +x mvnw

# Build your Spring Boot app without running tests (faster build)
RUN ./mvnw clean package -DskipTests

# Run the generated jar file (wildcard used to catch the actual jar name)
CMD ["sh", "-c", "jar"]