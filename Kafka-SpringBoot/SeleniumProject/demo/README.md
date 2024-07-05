mvn clean package


java -jar target/demo-0.0.1-SNAPSHOT.jar


docker build --tag=demo:latest .


docker run -p8887:8082 demo:latest

docker inspect demo
docker stop demo
docker rm demo