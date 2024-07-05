# T-DAT-901-LIL_1

The projects consists of scrapping data to a CryptoWebSite.
These data will be processing thanks to Kafka.
Kafka producer will pick the crypto and send it to kafka topics (storage).
Kafka consumer will receive a stream of data and handle it to save it to the database and Api fetch it to the react application.

## Table Of Content

- [Installation](#installation)
    - [Docker-compose](#Docker-compose)
    - [Run web interface](#Run-web-interface)
- [Apache kafka](#Apache-kafka)
    - [How kafka's working](#How-kafka's-working)
    - [Code architecture](#Code-architecture)
    - [Code's working](#Code's-working)
- [The team up](#Team_up)

## Installation

The installation is a necessary step before starting the running of java spring boot project and the reactJS.
In this step we will explain how can we starts the database, kafka, selenium (and chrome) and how running the microservice spring.

### Docker-compose

**Note:** Docker is required

First of all you need to run the docker-compose to build entirely the back project : 
-> 3 microservice spring
-> Kafka and his zookepper (the handler)
-> Selenium and his chrome image

```bash
docker-compose build
```

```bash
docker-compose up -d 
```

### Run-web-interface

**Note:** Node and NPM is required

Go to the directory crypto_stonks, and install his dependy

```bash
npm install
```

When the node package installation is done you could run the project 

```bash
npm start
```

Here we are ! The project is now run 

More details about running the react project are given below
[Readme to launch react interface](./crypto_stonks/README.md)


## Apache-kafka

Apache kafka is a distributed streaming platform that is designed to handle real-time data feeds.
It gives us a scalibity about the huge amount of data scrapping by Selenium and make a streaming process to supply the database 

### How-kafka's-working

Kafka operates on differents langages in my case I used it on java Spring boot (we can also use it in Python). 
Producers picks data from a CryptoWebSite with Selenium, and then this data are organized into topics. 
Consumers subscribe to these topics to receive and process the data.
These data are saved into the database before a formatting into a class

Kafka maintains durability and fault tolerance by persisting data to disk and replicating it across multiple brokers. 
The architecture ensures scalability, making Kafka a robust solution for handling large volumes of real-time streaming data in a distributed environment.
For example, is there any problem like the spring consummer which his crashing, kafka will take the relay and another time push it into the db. Plus kafka store the amount of data even if there's an issues, that's why there's huge scalability.

Here's a little schema that represent the actions of producing and listenning ...
<img width="1173" alt="fabric-patterns-screenshot" src="https://github.com/EpitechMscProPromo2024/T-DAT-901-LIL_1/blob/main/kafkaSystem.png?raw=true">

### Code-architecture

Here is a structure representation of the pathding project. "Some folder has been keep to track the evolution of the code."


- [.Docker compose](#Docker-compose)
- [KafkaProject](#Dockerfile)
    - [Dockerfile](#Dockerfile)
    - [Kafka-consumer-database](#Kafka-consumer-database)
    - [Kafka-producer-crypto](#Kafka-producer-crypto)
    - [Spring-api](#Spring-api)
- [Crypto_stonks](#Crypto_stonks)

#### Docker-compose

The docker-compose will deploy the solution to scrapData, give it to Kafka, send it to Database and also rend it access to the API through an endpoint.

#### Dockerfile

The Dockerfile are used to instantiate java spring in Docker and open an accees of he's utilisation.
There's 3 Dockerfiles for each of microservices
We will run maven step to have the jar and the dependency and before that we run the spring project.

#### Kafka-consumer-database

The kafka consumer will read the flow of data received on the kafka topic and will send it to the database.

#### Kafka-producer-crypto

The Kafka producer will scrapp the crypto and send it to kafka

#### Spring-api

The spring api make the access to the database.

#### Crypto_stonks

Crypto stonks is the web application used to display the data pick it before.
These data display thanks to reactJS are available in real time through table and graphics.


### Code's-working

Now move on `.\KafkaProject` directory.

We can find `pom.xml`, in this file we could find the configuration of the springs parents projects, and above all the 3 microservices.
The rest of the code are inplicits and the kafka config are in the properties files.


## Team_up

Louis Huyghe
Maxence Marqui
Théo Miquet
Houssam El affas
Samuel Fonseca

