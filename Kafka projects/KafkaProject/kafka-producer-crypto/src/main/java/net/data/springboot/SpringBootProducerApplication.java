package net.data.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringBootProducerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootProducerApplication.class);
    }
}
