package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.EMAIL_FIELD_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.PASSWORD_DOES_NOT_MATCH;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_ALREADY_EXISTS;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_DOES_NOT_EXIST;
import static com.epitech.cryptoProject.utils.TestConstants.FIRST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.LAST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.PASSWORD;
import static com.epitech.cryptoProject.utils.TestConstants.USERNAME;
import static com.epitech.cryptoProject.utils.TestConstants.USER_EMAIL;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import com.epitech.cryptoProject.data.RoleEnum;
import com.epitech.cryptoProject.data.User;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.LogUserDto;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.repositories.UsersRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @InjectMocks
  private AuthService authService;

  @Mock
  private UsersRepository usersRepository;

  @Mock
  private ModelMapper modelMapper;

  @Mock
  private JwtService jwtService;

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @Test
  @DisplayName("Should return a 201 response code when a user is successfully created")
  void testRegisterUser() {
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
        .role(RoleEnum.ADMIN)
        .build();
    final User user = User.builder()
        .username(USERNAME)
        .email(USER_EMAIL)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(PASSWORD)
        .role(RoleEnum.ADMIN)
        .build();

    given(usersRepository.getUserByEmail(anyString())).willReturn(Optional.empty());
    given(modelMapper.map(any(), eq(User.class))).willReturn(user);
    given(usersRepository.save(any())).willReturn(user);
    given(modelMapper.map(any(), eq(UserWithoutPwdDto.class))).willReturn(userWithoutPwdDto);

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.registerUser(userDto);

    assertTrue(result.isRight());

    final UserWithoutPwdDto userWithoutPwdDtoResult = result.get();

    assertEquals(USER_EMAIL, userWithoutPwdDtoResult.getEmail());
    assertEquals(USERNAME, userWithoutPwdDtoResult.getUsername());
    assertEquals(FIRST_NAME, userWithoutPwdDtoResult.getFirstName());
    assertEquals(LAST_NAME, userWithoutPwdDtoResult.getLastName());
    assertEquals(RoleEnum.ADMIN, userWithoutPwdDtoResult.getRole());
  }

  @Test
  @DisplayName("Should return 400 error code if email is missing in the request")
  void testRegisterUserEmailEmpty() {
    final UserDto userDto = UserDto.builder()
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(PASSWORD)
        .role(RoleEnum.ADMIN)
        .build();

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.registerUser(userDto);

    assertTrue(result.isLeft());
    assertEquals(400, result.getLeft().getCode());
    assertEquals(EMAIL_FIELD_MANDATORY, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 400 error code if the user already exists")
  void testRegisterUserAlreadyExists() {
    final UserDto userDto = UserDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(PASSWORD)
        .role(RoleEnum.ADMIN)
        .build();
    final User user = User.builder()
        .username(USERNAME)
        .email(USER_EMAIL)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .role(RoleEnum.ADMIN)
        .build();

    given(usersRepository.getUserByEmail(anyString())).willReturn(Optional.of(user));

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.registerUser(userDto);

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(USER_ALREADY_EXISTS, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 200 response code when a user is successfully logged in")
  void testLogUser() {
    final LogUserDto logUserDto = LogUserDto.builder()
        .email(USER_EMAIL)
        .password(PASSWORD)
        .build();
    final UserWithoutPwdDto userWithoutPwdDto = UserWithoutPwdDto.builder()
        .email(USER_EMAIL)
        .username(USERNAME)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .role(RoleEnum.ADMIN)
        .build();
    final User user = User.builder()
        .username(USERNAME)
        .email(USER_EMAIL)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(passwordEncoder.encode(PASSWORD))
        .role(RoleEnum.ADMIN)
        .build();

    given(usersRepository.getUserByEmail(anyString())).willReturn(Optional.of(user));
    given(modelMapper.map(any(), eq(UserWithoutPwdDto.class))).willReturn(userWithoutPwdDto);
    given(jwtService.generateJwtToken(any())).willReturn(userWithoutPwdDto);

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.logUser(logUserDto);

    assertTrue(result.isRight());

    final UserWithoutPwdDto userWithoutPwdDtoResult = result.get();

    assertEquals(USER_EMAIL, userWithoutPwdDtoResult.getEmail());
    assertEquals(USERNAME, userWithoutPwdDtoResult.getUsername());
    assertEquals(FIRST_NAME, userWithoutPwdDtoResult.getFirstName());
    assertEquals(LAST_NAME, userWithoutPwdDtoResult.getLastName());
    assertEquals(RoleEnum.ADMIN, userWithoutPwdDtoResult.getRole());
  }

  @Test
  @DisplayName("Should return 400 error code if email is missing in the request")
  void testLogUserEmailEmpty() {
    final LogUserDto logUserDto = LogUserDto.builder()
        .password(PASSWORD)
        .build();

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.logUser(logUserDto);

    assertTrue(result.isLeft());
    assertEquals(400, result.getLeft().getCode());
    assertEquals(EMAIL_FIELD_MANDATORY, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 400 error code if the password does not match")
  void testLogUserIfPasswordDoesNotMatch() {
    final LogUserDto logUserDto = LogUserDto.builder()
        .email(USER_EMAIL)
        .password("badPassword")
        .build();
    final User user = User.builder()
        .username(USERNAME)
        .email(USER_EMAIL)
        .firstName(FIRST_NAME)
        .lastName(LAST_NAME)
        .password(passwordEncoder.encode(PASSWORD))
        .role(RoleEnum.ADMIN)
        .build();

    given(usersRepository.getUserByEmail(anyString())).willReturn(Optional.of(user));

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.logUser(logUserDto);

    assertTrue(result.isLeft());
    assertEquals(400, result.getLeft().getCode());
    assertEquals(PASSWORD_DOES_NOT_MATCH, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 404 error code if the user does not exist")
  void testLogUserIfUserDoesNotExist() {
    final LogUserDto logUserDto = LogUserDto.builder()
        .email(USER_EMAIL)
        .password(PASSWORD)
        .build();

    given(usersRepository.getUserByEmail(anyString())).willReturn(Optional.empty());

    final Either<ErrorResponseMessage, UserWithoutPwdDto> result = authService.logUser(logUserDto);

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(USER_DOES_NOT_EXIST, result.getLeft().getMessage());
  }
}
