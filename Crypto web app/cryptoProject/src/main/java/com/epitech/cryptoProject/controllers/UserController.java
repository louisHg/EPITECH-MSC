package com.epitech.cryptoProject.controllers;

import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.services.UserService;
import com.epitech.cryptoProject.utils.ResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import java.util.UUID;
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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/updateUser")
  @Operation(description = "Update a user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "User successfully registered"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })

  public ResponseEntity<UserWithoutPwdDto> updateUser(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody UserDto userDto) {
    return (ResponseEntity<UserWithoutPwdDto>) ResponseWrapper.matchEitherOnPost(
        userService.updateUser(userDto, authorization));
  }

  @GetMapping
  @Operation(description = "Get all users")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Users successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<List<UserDto>> getUsers(
      @RequestHeader("Authorization") String authorization) {
    return (ResponseEntity<List<UserDto>>) ResponseWrapper.matchEitherOnGetOrPatch(userService.getUsers(authorization));
  }

  @GetMapping("/{user_id}")
  @Operation(description = "Get User by Id")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "User successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<UserDto> getUserById(
      @RequestHeader("Authorization") String authorization,
      @PathVariable("user_id") @Parameter(required = true, name = "user_id", description = "User id",
          example = "99bb_...") UUID userId) {
    return (ResponseEntity<UserDto>) ResponseWrapper.matchEitherOnGetOrPatch(userService.getUserById(userId, authorization));
  }

  @DeleteMapping
  @Operation(description = "Delete users in database")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Users successfully deleted in database"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<?> deleteUsers(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody List<UUID> userUuidList) {

    return ResponseWrapper.matchOptionalOnDelete(userService.deleteUser(userUuidList, authorization));
  }

}
