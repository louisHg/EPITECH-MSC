package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_COIN_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_COIN_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.epitech.cryptoProject.data.Coin;
import com.epitech.cryptoProject.dtos.CoinDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.repositories.CoinsRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class CoinServiceTest {

  @InjectMocks
  private CoinService coinService;

  @Mock
  private CoinsRepository coinsRepository;

  @Mock
  private JwtService jwtService;

  @Mock
  private ModelMapper modelMapper;

  private final Integer COIN_ID_1 = 1;
  private final Integer COIN_ID_2 = 2;
  private final String COIN_NAME_BTC = "BTC";
  private final String COIN_NAME_ETH = "ETH";
  private final Coin COIN = Coin.builder().id(COIN_ID_1).name(COIN_NAME_BTC).build();
  private final Coin SECOND_COIN = Coin.builder().id(COIN_ID_2).name(COIN_NAME_ETH).build();
  private final CoinDto COIN_DTO = CoinDto.builder().id(COIN_ID_1).name(COIN_NAME_BTC).build();
  private final CoinDto SECOND_COIN_DTO = CoinDto.builder().id(COIN_ID_2).name(COIN_NAME_ETH).build();

  @Test
  @DisplayName("Should return a 201 response code when given coins had been saved")
  void testSaveCoins() {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(true);
    given(modelMapper.map(any(), eq(Coin.class))).willReturn(COIN, SECOND_COIN);
    given(coinsRepository.saveAll(anyList())).willReturn(List.of(COIN, SECOND_COIN));
    given(modelMapper.map(any(), eq(CoinDto.class))).willReturn(COIN_DTO, SECOND_COIN_DTO);

    final Either<ErrorResponseMessage, List<CoinDto>> result = coinService.saveCoins(coinDtoList, ADMIN_TOKEN);

    assertTrue(result.isRight());
    assertEquals(COIN_DTO, result.get().get(0));
    assertEquals(SECOND_COIN_DTO, result.get().get(1));
  }

  @Test
  @DisplayName("Should return a 401 response if the user is not an admin")
  void testSaveCoinsNotAdmin() {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(false);

    final Either<ErrorResponseMessage, List<CoinDto>> result = coinService.saveCoins(coinDtoList, ADMIN_TOKEN);

    verify(jwtService, times(1)).isAdmin(anyString());

    assertTrue(result.isLeft());
    assertEquals(401, result.getLeft().getCode());
    assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 400 bad request response code when there is an empty id or name in coins given")
  void testSaveCoinsErrorIfIdEmpty() {
    final CoinDto coinDtoEmptyId = CoinDto.builder().build();
    final List<CoinDto> coinDtoList = List.of(coinDtoEmptyId, SECOND_COIN_DTO);
    final String errorMessage = BAD_COIN_GIVEN + " " + coinDtoEmptyId;

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Either<ErrorResponseMessage, List<CoinDto>> result = coinService.saveCoins(coinDtoList, ADMIN_TOKEN);

    assertTrue(result.isLeft());
    assertEquals(HttpStatus.BAD_REQUEST.value(), result.getLeft().getCode());
    assertEquals(errorMessage, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 200 response code with a List<CoinDto>")
  void testGetCoins() {
    final Coin coin = Coin.builder().name(COIN_NAME_BTC).id(COIN_ID_1).build();
    final Coin secondCoin = Coin.builder().name(COIN_NAME_ETH).id(COIN_ID_2).build();
    final List<Coin> coinList = List.of(coin, secondCoin);

    given(coinsRepository.findAll()).willReturn(coinList);
    given(modelMapper.map(any(), eq(CoinDto.class))).willReturn(COIN_DTO, SECOND_COIN_DTO);

    final Either<ErrorResponseMessage, List<CoinDto>> result = coinService.getCoins();

    assertTrue(result.isRight());
    assertEquals(COIN_DTO, result.get().get(0));
    assertEquals(SECOND_COIN_DTO, result.get().get(1));
  }

  @Test
  @DisplayName("Should return a 404 not found response code if there are no coins")
  void testGetCoinsErrorNotFound() {
    given(coinsRepository.findAll()).willReturn(Collections.emptyList());

    final Either<ErrorResponseMessage, List<CoinDto>> result = coinService.getCoins();

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(NO_COIN_FOUND, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 200 response code if a coin is retrieved")
  void testGetCoinById() {
    final Coin coin = Coin.builder().id(COIN_ID_1).name(COIN_NAME_BTC).build();

    given(coinsRepository.findById(any())).willReturn(Optional.of(coin));
    given(modelMapper.map(any(), eq(CoinDto.class))).willReturn(COIN_DTO);

    final Either<ErrorResponseMessage, CoinDto> result = coinService.getCoinById(COIN_ID_1);

    assertTrue(result.isRight());
    assertEquals(COIN_DTO, result.get());
  }

  @Test
  @DisplayName("Should return a 404 not found response code if there is no coin with the given id")
  void testGetCoinByIdErrorNotFound() {
    given(coinsRepository.findById(any())).willReturn(Optional.empty());

    final Either<ErrorResponseMessage, CoinDto> result = coinService.getCoinById(COIN_ID_1);

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(NO_COIN_FOUND, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 204 response code when given coins are deleted")
  void testDeleteCoins() {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Optional<ErrorResponseMessage> result = coinService.deleteCoins(coinDtoList, ADMIN_TOKEN);

    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return a 401 if the user is not an admin")
  void testDeleteCoinsNotAdmin() {
    final List<CoinDto> coinDtoList = List.of(COIN_DTO, SECOND_COIN_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(false);

    final Optional<ErrorResponseMessage> result = coinService.deleteCoins(coinDtoList, ADMIN_TOKEN);

    verify(jwtService, times(1)).isAdmin(anyString());

    assertTrue(result.isPresent());
    assertEquals(401, result.get().getCode());
    assertEquals(ROLE_ADMIN_MANDATORY, result.get().getMessage());
  }

  @Test
  @DisplayName("Should return a 400 bad request response code when there an empty id or name in coin given")
  void testDeleteCoinsErrorIfIdEmpty() {
    final CoinDto coinDtoEmptyId = CoinDto.builder().name(COIN_NAME_BTC).build();
    final List<CoinDto> coinDtoList = List.of(coinDtoEmptyId, SECOND_COIN_DTO);
    final String errorMessage = BAD_COIN_GIVEN + " " + coinDtoEmptyId;

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Optional<ErrorResponseMessage> result = coinService.deleteCoins(coinDtoList, ADMIN_TOKEN);

    assertTrue(result.isPresent());
    assertEquals(HttpStatus.BAD_REQUEST.value(), result.get().getCode());
    assertEquals(errorMessage, result.get().getMessage());
  }
}
