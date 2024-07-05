package com.epitech.cryptoProject.controllers;

import static com.epitech.cryptoProject.controllers.JsonMapperControllerTest.objectMapper;
import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_COIN_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_COIN_FOUND;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epitech.cryptoProject.dtos.CoinDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.services.CoinService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CoinControllerTest {

  @Autowired
  protected MockMvc mockMvc;

  @MockBean
  private CoinService coinService;

  private final String COINS_ENDPOINT = "/coins";

  private final Integer COIN_ID_1 = 1;
  private final Integer COIN_ID_2 = 2;
  private final String COIN_NAME_BTC = "BTC";
  private final String COIN_NAME_ETH = "ETH";
  private final CoinDto COIN_DTO = CoinDto.builder().id(COIN_ID_1).name(COIN_NAME_BTC).build();
  private final CoinDto SECOND_COIN_DTO = CoinDto.builder().id(COIN_ID_2).name(COIN_NAME_ETH).build();

  @Test
  @DisplayName("Should return a 201 response code when coins were been saved")
  void testSaveCoins() throws Exception {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(coinService.saveCoins(anyList(), anyString())).willReturn(right(coinDtoList));

    mockMvc.perform(post(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(coinDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$[0].id").value(COIN_ID_1))
        .andExpect(jsonPath("$[0].name").value(COIN_NAME_BTC))
        .andExpect(jsonPath("$[1].id").value(COIN_ID_2))
        .andExpect(jsonPath("$[1].name").value(COIN_NAME_ETH));
  }

  @Test
  @DisplayName("Should return a 400 response code if coin id or coin name is empty")
  void testSaveCoinsErrorIdEmpty() throws Exception {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);
    final String errorMessage = BAD_COIN_GIVEN + " " + COIN_DTO;

    given(coinService.saveCoins(anyList(), anyString())).willReturn(left(ErrorResponseMessage.of(400, errorMessage)));

    mockMvc.perform(post(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(coinDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(jsonPath("$.message").value(errorMessage));
  }

  @Test
  @DisplayName("Should return a 200 response code when coins are successfully retrieved")
  void testGetCoins() throws Exception {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(coinService.getCoins()).willReturn(right(coinDtoList));

    mockMvc.perform(get(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(coinDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(COIN_ID_1))
        .andExpect(jsonPath("$[0].name").value(COIN_NAME_BTC))
        .andExpect(jsonPath("$[1].id").value(COIN_ID_2))
        .andExpect(jsonPath("$[1].name").value(COIN_NAME_ETH));
  }

  @Test
  @DisplayName("Should return a 404 response code when there are no coins saved")
  void testGetCoinsNotFound() throws Exception {
    given(coinService.getCoins()).willReturn(left(ErrorResponseMessage.of(404, NO_COIN_FOUND)));

    mockMvc.perform(get(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_COIN_FOUND));
  }

  @Test
  @DisplayName("Should return a 200 response code when coin with given id is successfully retrieved")
  void testGetCoinById() throws Exception {
    final CoinDto coinDto = CoinDto.builder().id(COIN_ID_1).name(COIN_NAME_BTC).build();

    given(coinService.getCoinById(any())).willReturn(right(coinDto));

    mockMvc.perform(get(COINS_ENDPOINT + "/" + COIN_ID_1)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(COIN_ID_1))
        .andExpect(jsonPath("$.name").value(COIN_NAME_BTC));
  }

  @Test
  @DisplayName("Should return a 404 response code when there is no coin with the given id")
  void testGetCoinByIdNotFound() throws Exception {
    given(coinService.getCoinById(COIN_ID_1)).willReturn(left(ErrorResponseMessage.of(404, NO_COIN_FOUND)));

    mockMvc.perform(get(COINS_ENDPOINT + "/" + COIN_ID_1)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_COIN_FOUND));
  }

  @Test
  @DisplayName("Should return a 204 response code when coins are successfully deleted")
  void testDeleteCoins() throws Exception {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(coinService.deleteCoins(anyList(), anyString())).willReturn(Optional.empty());

    mockMvc.perform(delete(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(coinDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @DisplayName("Should return a 201 response code when coins were been saved")
  void testDeleteCoinsErrorMessage() throws Exception {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(400, BAD_COIN_GIVEN + " " + COIN_DTO);

    given(coinService.deleteCoins(anyList(), anyString())).willReturn(Optional.of(errorResponseMessage));

    mockMvc.perform(delete(COINS_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(coinDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(errorResponseMessage.getCode()))
        .andExpect(jsonPath("$.message").value(errorResponseMessage.getMessage()));
  }
}
