package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.EMAIL_FIELD_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.PASSWORD_DOES_NOT_MATCH;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_ALREADY_EXISTS;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_DOES_NOT_EXIST;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;

import com.epitech.cryptoProject.data.User;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.LogUserDto;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.repositories.UsersRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

  private final UsersRepository usersRepository;
  private final ModelMapper modelMapper;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public AuthService(UsersRepository usersRepository, ModelMapper modelMapper, JwtService jwtService) {
    this.usersRepository = usersRepository;
    this.modelMapper = modelMapper;
    this.jwtService = jwtService;
  }

  public Either<ErrorResponseMessage, UserWithoutPwdDto> registerUser(final UserDto userDto) {

    if (Objects.isNull(userDto.getEmail())) {
      log.error("Email field is missing for this request");
      return left(ErrorResponseMessage.of(400, EMAIL_FIELD_MANDATORY));
    }

    final Optional<User> optionalUser = usersRepository.getUserByEmail(userDto.getEmail());

    if (optionalUser.isPresent()) {
      log.warn("User already exists for email : " + userDto.getEmail());
      return left(ErrorResponseMessage.of(404, USER_ALREADY_EXISTS));
    }

    final LocalDateTime localDateTimeNow = LocalDateTime.now();
    userDto.setCreatedAt(localDateTimeNow);
    userDto.setUpdatedAt(localDateTimeNow);
    userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

    final User user = modelMapper.map(userDto, User.class);
    final User userSaved = usersRepository.save(user);

    log.info("User successfully created with username : " + userSaved.getUsername());

    final UserWithoutPwdDto userCreated = modelMapper.map(userSaved, UserWithoutPwdDto.class);

    return right(userCreated);
  }

  public Either<ErrorResponseMessage, UserWithoutPwdDto> logUser(final LogUserDto logUserDto) {

    if (Objects.isNull(logUserDto.getEmail())) {
      log.error("Email field is missing for this request");
      return left(ErrorResponseMessage.of(400, EMAIL_FIELD_MANDATORY));
    }

    final Optional<User> optionalUser = usersRepository.getUserByEmail(logUserDto.getEmail());

    if (!optionalUser.isPresent()) {
      return left(ErrorResponseMessage.of(404, USER_DOES_NOT_EXIST));
    }

    if (!passwordEncoder.matches(logUserDto.getPassword(), optionalUser.get().getPassword())) {
      log.error("Password doesn't match for user : " + logUserDto.getEmail());
      return left(ErrorResponseMessage.of(400, PASSWORD_DOES_NOT_MATCH));
    }

    final UserWithoutPwdDto userWithoutPwdDto = modelMapper.map(optionalUser.get(), UserWithoutPwdDto.class);

    return right(jwtService.generateJwtToken(userWithoutPwdDto));
  }
}
