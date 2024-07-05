package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_USER_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.EMAIL_FIELD_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_ALREADY_EXISTS;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_NOT_FOUND;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;

import com.epitech.cryptoProject.data.User;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.repositories.UsersRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class UserService {

  private final UsersRepository usersRepository;
  private final ModelMapper modelMapper;
  private final JwtService jwtService;

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public UserService(UsersRepository usersRepository, ModelMapper modelMapper, JwtService jwtService) {
    this.usersRepository = usersRepository;
    this.modelMapper = modelMapper;
    this.jwtService = jwtService;
  }

  public Either<ErrorResponseMessage, UserWithoutPwdDto> updateUser (final UserDto userDto, final String authorization) {

    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    if (Objects.isNull(userDto.getEmail())) {
      log.error("Email field is missing for this request");
      return left(ErrorResponseMessage.of(400, EMAIL_FIELD_MANDATORY));
    }

    // To check if 1 has already this email
    String emailExist = usersRepository.checkIfEmailExist(userDto.getEmail());

    final Optional<User> currentUser = usersRepository.findUserByUuid(userDto.getUuid());
    final String currentEmail = currentUser.get().getEmail();
    final UUID currentUUid = currentUser.get().getUuid();

    if (emailExist != null && !userDto.getEmail().equals(currentEmail) && userDto.getUuid().equals(currentUUid)) {
      log.warn("User already exists for email : " + userDto.getEmail());
      return left(ErrorResponseMessage.of(404, USER_ALREADY_EXISTS));
    }

    final LocalDateTime localDateTimeNow = LocalDateTime.now();
    userDto.setCreatedAt(localDateTimeNow);
    userDto.setUpdatedAt(localDateTimeNow);
    userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

    final User user = modelMapper.map(userDto, User.class);
    final User userSaved = usersRepository.save(user);

    log.info("User successfully updated with username : " + userSaved.getUsername());

    final UserWithoutPwdDto userModified = modelMapper.map(userSaved, UserWithoutPwdDto.class);

    return right(userModified);
  }

  public Either<ErrorResponseMessage, List<UserDto>> getUsers(final String authorization) {

    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final List<User> userList = usersRepository.findAll();

    if (userList.isEmpty()) {
      return left(ErrorResponseMessage.of(404, USER_NOT_FOUND));
    }

    final List<UserDto> userDtoList = userList.stream().map(user -> modelMapper.map(user, UserDto.class))
            .collect(Collectors.toList());

    return right(userDtoList);
  }

  public Either<ErrorResponseMessage, UserDto> getUserById(final UUID uuid, final String authorization) {

    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<User> optionalUser = usersRepository.findUserByUuid(uuid);

    if (optionalUser.isEmpty()) {
      return left(ErrorResponseMessage.of(404, USER_NOT_FOUND));
    }

    final UserDto userDto = modelMapper.map(optionalUser.get(), UserDto.class);

    return right(userDto);
  }

  public Optional<ErrorResponseMessage> deleteUser(final List<UUID> userUuidList, final String authorization) {

    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return Optional.of(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    usersRepository.deleteAllByUuid(userUuidList);

    return Optional.empty();
  }
}
