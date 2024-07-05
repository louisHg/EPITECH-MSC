#!/bin/bash

# Start ChromeDriver in the background
chromedriver &

# Wait for ChromeDriver to be ready
sleep 5

# Run your Java application
java -jar /app/demo-0.0.1-SNAPSHOT.jar
