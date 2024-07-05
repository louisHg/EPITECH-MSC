package com.epitech.cryptoProject.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
public abstract class JsonMapperControllerTest {

  protected static final ObjectMapper objectMapper = new ObjectMapper();
}
