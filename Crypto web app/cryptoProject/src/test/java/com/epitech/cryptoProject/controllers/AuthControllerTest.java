package com.epitech.cryptoProject.controllers;

import static com.epitech.cryptoProject.utils.TestConstants.FIRST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.LAST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.PASSWORD;
import static com.epitech.cryptoProject.utils.TestConstants.USERNAME;
import static com.epitech.cryptoProject.utils.TestConstants.USER_EMAIL;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epitech.cryptoProject.data.RoleEnum;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.LogUserDto;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.services.AuthService;
import io.vavr.control.Either;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest extends JsonMapperControllerTest {

  @Autowired
  protected MockMvc mockMvc;

  @MockBean
  private AuthService authService;

  private final String REGISTER_ENDPOINT = "/auth/register";
  private final String LOGIN_ENDPOINT = "/auth/login";

  @Test
  @DisplayName("Should return a 201 response code when user has been created")
  void testRegisterUser() throws Exception {

    final UserDto userDto = UserDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(PASSWORD)
        .role(RoleEnum.ADMIN)
        .build();
    final UserWithoutPwdDto userWithoutPwdDto = UserWithoutPwdDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .role(RoleEnum.ADMIN).build();

    given(authService.registerUser(userDto)).willReturn(Either.right(userWithoutPwdDto));

    mockMvc.perform(post(REGISTER_ENDPOINT)
            .content(objectMapper.writeValueAsBytes(userDto))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email").value(USER_EMAIL))
        .andExpect(jsonPath("$.username").value(USERNAME))
        .andExpect(jsonPath("$.firstName").value(FIRST_NAME))
        .andExpect(jsonPath("$.lastName").value(LAST_NAME))
        .andExpect(jsonPath("$.role").value(userWithoutPwdDto.getRole().toString()))
        .andExpect(jsonPath("$.password").doesNotExist());
  }

  @Test
  @DisplayName("Should return a 404 bad request response when user already exists")
  void testRegisterUserIfUserAlreadyExists() throws Exception {

    final UserDto userDto = UserDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(PASSWORD)
        .role(RoleEnum.ADMIN)
        .build();
    final String errorMessage = "User already exists";

    given(authService.registerUser(userDto)).willReturn(Either.left(ErrorResponseMessage.of(404, errorMessage)));

    mockMvc.perform(post(REGISTER_ENDPOINT)
            .content(objectMapper.writeValueAsBytes(userDto))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404))
        .andExpect(jsonPath("$.message").value(errorMessage));
  }

  @Test
  @DisplayName("Should return a 200 response code when user has been logged in")
  void testLoginUser() throws Exception {

    final LogUserDto logUserDto = LogUserDto.builder()
        .email(USER_EMAIL)
        .password(PASSWORD)
        .build();
    final UserWithoutPwdDto userWithoutPwdDto = UserWithoutPwdDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .role(RoleEnum.ADMIN).build();

    given(authService.logUser(logUserDto)).willReturn(Either.right(userWithoutPwdDto));

    mockMvc.perform(post(LOGIN_ENDPOINT)
            .content(objectMapper.writeValueAsBytes(logUserDto))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value(USER_EMAIL))
        .andExpect(jsonPath("$.username").value(USERNAME))
        .andExpect(jsonPath("$.firstName").value(FIRST_NAME))
        .andExpect(jsonPath("$.lastName").value(LAST_NAME))
        .andExpect(jsonPath("$.role").value(userWithoutPwdDto.getRole().toString()))
        .andExpect(jsonPath("$.password").doesNotExist());
  }

  @Test
  @DisplayName("Should return a 404 bad request response when user does not exist")
  void testLoginUserIfUserDoesNotExist() throws Exception {

    final LogUserDto logUserDto = LogUserDto.builder()
        .email(USER_EMAIL)
        .password(PASSWORD)
        .build();
    final String errorMessage = "User does not exist";

    given(authService.logUser(logUserDto)).willReturn(Either.left(ErrorResponseMessage.of(404, errorMessage)));

    mockMvc.perform(post(LOGIN_ENDPOINT)
            .content(objectMapper.writeValueAsBytes(logUserDto))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404))
        .andExpect(jsonPath("$.message").value(errorMessage));
  }
}
