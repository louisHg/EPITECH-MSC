package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_COIN_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_COIN_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;

import com.epitech.cryptoProject.data.Coin;
import com.epitech.cryptoProject.dtos.CoinDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.repositories.CoinsRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class CoinService {

  private final CoinsRepository coinsRepository;
  private final ModelMapper modelMapper;
  private final JwtService jwtService;

  public CoinService(CoinsRepository coinsRepository, ModelMapper modelMapper, JwtService jwtService) {
    this.coinsRepository = coinsRepository;
    this.modelMapper = modelMapper;
    this.jwtService = jwtService;
  }

  public Either<ErrorResponseMessage, List<CoinDto>> saveCoins(final List<CoinDto> coinDtoList, final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<CoinDto> badCoinGiven = coinDtoList.stream()
        .filter(coinDto -> Objects.isNull(coinDto.getName())).findFirst();

    if (badCoinGiven.isPresent()) {
      return left(ErrorResponseMessage.of(400, BAD_COIN_GIVEN + " " + badCoinGiven.get()));
    }

    final List<Coin> coinListToSave = coinDtoList.stream().map(coinDto -> modelMapper.map(coinDto, Coin.class))
        .collect(Collectors.toList());

    final List<Coin> coinListSaved = coinsRepository.saveAll(coinListToSave);

    final List<CoinDto> coinDtoListSaved = coinListSaved.stream().map(coin -> modelMapper.map(coin, CoinDto.class)).collect(Collectors.toList());

    return right(coinDtoListSaved);
  }

  public Either<ErrorResponseMessage, List<CoinDto>> getCoins() {
    final List<Coin> coinList = coinsRepository.findAll();

    if (coinList.isEmpty()) {
      return left(ErrorResponseMessage.of(404, NO_COIN_FOUND));
    }

    final List<CoinDto> coinDtoList = coinList.stream().map(coin -> modelMapper.map(coin, CoinDto.class))
        .collect(Collectors.toList());

    return right(coinDtoList);
  }

  public Either<ErrorResponseMessage, CoinDto> getCoinById(final Integer coinId) {
    final Optional<Coin> optionalCoin = coinsRepository.findById(coinId);

    if (optionalCoin.isEmpty()) {
      return left(ErrorResponseMessage.of(404, NO_COIN_FOUND));
    }

    final CoinDto coinDto = modelMapper.map(optionalCoin.get(), CoinDto.class);

    return right(coinDto);
  }

  public Optional<ErrorResponseMessage> deleteCoins(final List<CoinDto> coinDtoList, final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return Optional.of(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<CoinDto> badCoinGiven = coinDtoList.stream()
        .filter(coinDto -> Objects.isNull(coinDto.getId()) || Objects.isNull(coinDto.getName())).findFirst();

    if (badCoinGiven.isPresent()) {
      return Optional.of(ErrorResponseMessage.of(400, BAD_COIN_GIVEN + " " + badCoinGiven.get()));
    }

    final List<Coin> coinList = coinDtoList.stream().map(coinDto -> modelMapper.map(coinDto, Coin.class))
        .collect(Collectors.toList());

    coinsRepository.deleteAll(coinList);

    return Optional.empty();
  }
}
