# kafka-installation

# Command uses 

## Display docker container 
```docker ps```

### Move into Kafka container
```docker exec -it <kafka_conatiner_id> /bin/sh```
### Go inside kafka installation folder
```cd /opt/kafka_<version>/bin```
### Create Kafka topic
```kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic quickstart```
### Start Producer app (CLI)
```kafka-console-producer.sh --topic quickstart --bootstrap-server localhost:9092```
And before send message
### Start consumer app (CLI)
```kafka-console-consumer.sh --topic quickstart --from-beginning --bootstrap-server localhost:9092```
kafka-console-consumer.sh --topic crypto_recentchange --from-beginning --bootstrap-server localhost:9092