package com.epitech.cryptoProject.controllers;

import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.LogUserDto;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.services.AuthService;
import com.epitech.cryptoProject.utils.ResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  @Operation(description = "Register a user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "User successfully registered"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<UserWithoutPwdDto> createUser(
      @Valid @RequestBody UserDto userDto) {

    return (ResponseEntity<UserWithoutPwdDto>) ResponseWrapper.matchEitherOnPost(authService.registerUser(userDto));
  }

  @PostMapping("/login")
  @Operation(description = "Log a user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User successfully logged in"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<UserWithoutPwdDto> logUser(
      @Valid @RequestBody LogUserDto logUserDto) {

    return (ResponseEntity<UserWithoutPwdDto>) ResponseWrapper.matchEitherOnPostForLogin(authService.logUser(logUserDto));
  }
}
