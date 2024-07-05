package net.database.springboot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.database.springboot.entite.CryptoData;
import net.database.springboot.repository.CryptoDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@SuppressWarnings("java:S3011")
public class KafkaDatabaseConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaDatabaseConsumer.class);

    private static final Map<String, Field> FIELD_MAP = new HashMap<>();

    private CryptoDataRepository cryptoDataRepository;

    public KafkaDatabaseConsumer(CryptoDataRepository cryptoDataRepository) {
        this.cryptoDataRepository = cryptoDataRepository;
    }

    @KafkaListener(
            topics = "${spring.kafka.topic.name}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String eventMessage) throws JsonProcessingException {
        LOGGER.info(String.format("Event message received -> %s", eventMessage));

        // Retrieve List<CryptoData> from JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        List<CryptoData> cryptoDataList = objectMapper.readValue(eventMessage, new TypeReference<List<CryptoData>>(){});
        // Save the list of CryptoData to the repository
        cryptoDataRepository.saveAll(cryptoDataList);

        LOGGER.info("Saved");
    }
}