FROM maven:3.8.4-openjdk-17-slim
LABEL org.opencontainers.image.authors="louis"

# Set the working directory in the container
WORKDIR /app

# Copy the entire project (source code and resources)
COPY . /app/

# Download and install Maven dependencies
RUN mvn clean install -DskipTests

# Package the application
RUN mvn package -DskipTests

# Copy the application JAR file to the container
COPY target/demo-0.0.1-SNAPSHOT.jar /app/demo-0.0.1-SNAPSHOT.jar

# Define the command to run your application
ENTRYPOINT ["java", "-jar", "/app/demo-0.0.1-SNAPSHOT.jar"]
