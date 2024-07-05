package com.epitech.cryptoProject.controllers;

import com.epitech.cryptoProject.dtos.CoinDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.services.CoinService;
import com.epitech.cryptoProject.utils.ResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coins")
public class CoinController {

  private final CoinService coinService;

  public CoinController(CoinService coinService) {
    this.coinService = coinService;
  }

  @PostMapping
  @CrossOrigin(origins = "http://localhost:3000")
  @Operation(description = "Save coins in database")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Coins successfully saved in database"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<List<CoinDto>> saveCoins(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody List<CoinDto> coinDtoList) {

    return (ResponseEntity<List<CoinDto>>) ResponseWrapper.matchEitherOnPost(coinService.saveCoins(coinDtoList, authorization));
  }

  @GetMapping
  @Operation(description = "Get all coins")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Coins successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<List<CoinDto>> getCoins() {

    return (ResponseEntity<List<CoinDto>>) ResponseWrapper.matchEitherOnGetOrPatch(coinService.getCoins());
  }

  @GetMapping("/{coin_id}")
  @Operation(description = "Get coin by Id")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Coin successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<CoinDto> getCoinById(
      @PathVariable("coin_id") @Parameter(required = true, name = "coin_id", description = "Coin id",
          example = "1234") Integer coinId) {

    return (ResponseEntity<CoinDto>) ResponseWrapper.matchEitherOnGetOrPatch(coinService.getCoinById(coinId));
  }

  @DeleteMapping
  @Operation(description = "Delete coins in database")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Coins successfully deleted in database"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<?> deleteCoins(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody List<CoinDto> coinDtoList) {

    return ResponseWrapper.matchOptionalOnDelete(coinService.deleteCoins(coinDtoList, authorization));
  }
}
