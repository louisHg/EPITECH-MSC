package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.EMAIL_FIELD_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_ALREADY_EXISTS;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_NOT_FOUND;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static com.epitech.cryptoProject.utils.TestConstants.FIRST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.LAST_NAME;
import static com.epitech.cryptoProject.utils.TestConstants.LOSER_TOKEN;
import static com.epitech.cryptoProject.utils.TestConstants.PASSWORD;
import static com.epitech.cryptoProject.utils.TestConstants.USERNAME;
import static com.epitech.cryptoProject.utils.TestConstants.USER_EMAIL;
import static com.epitech.cryptoProject.utils.TestConstants.USER_UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.epitech.cryptoProject.data.RoleEnum;
import com.epitech.cryptoProject.data.User;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.repositories.UsersRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private JwtService jwtService;

    @Test
    @DisplayName("Should return a 201 response code when a user is successfully modified")
    void testUpdateUser() {
        final UserDto userDto = UserDto.builder()
                .uuid(USER_UUID)
                .email(USER_EMAIL)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        final UserWithoutPwdDto userWithoutPwdDto = UserWithoutPwdDto.builder()
                .uuid(USER_UUID)
                .email(USER_EMAIL)
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .role(RoleEnum.ADMIN)
                .build();

        final Optional<User> user = Optional.ofNullable(User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build());

        final User user2 = User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        given(usersRepository.checkIfEmailExist(anyString())).willReturn(String.valueOf(Optional.empty()));
        given(usersRepository.findUserByUuid(userDto.getUuid())).willReturn(user);
        given(modelMapper.map(any(), eq(User.class))).willReturn(user2);
        given(usersRepository.save(user2)).willReturn(user2);
        given(modelMapper.map(any(), eq(UserWithoutPwdDto.class))).willReturn(userWithoutPwdDto);
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, UserWithoutPwdDto> result = userService.updateUser(userDto, ADMIN_TOKEN);

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
    void testUpdateUserEmailEmpty() {
        final UserDto userDto = UserDto.builder()
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, UserWithoutPwdDto> result = userService.updateUser(userDto, ADMIN_TOKEN);

        assertTrue(result.isLeft());
        assertEquals(400, result.getLeft().getCode());
        assertEquals(EMAIL_FIELD_MANDATORY, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 400 error code if the user already exists")
    void testUpdateUserAlreadyExists() {

        final UserDto userDto = UserDto.builder()
                .uuid(USER_UUID)
                .email("tata@gmail.com")
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        final Optional<User> user = Optional.ofNullable(User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build());

        given(jwtService.isAdmin(anyString())).willReturn(true);

        given(usersRepository.checkIfEmailExist(anyString())).willReturn(String.valueOf(userDto.getEmail()));
        given(usersRepository.findUserByUuid(userDto.getUuid())).willReturn(user);

        final Either<ErrorResponseMessage, UserWithoutPwdDto> result = userService.updateUser(userDto, ADMIN_TOKEN);

        assertTrue(result.isLeft());
        assertEquals(404, result.getLeft().getCode());
        assertEquals(USER_ALREADY_EXISTS, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 401 error code if the user role is not admin")
    void testUpdateUserNotAdmin() {

        final UserDto userDto = UserDto.builder()
                .uuid(USER_UUID)
                .email("tata@gmail.com")
                .username(USERNAME)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        given(jwtService.isAdmin(anyString())).willReturn(false);

        final Either<ErrorResponseMessage, UserWithoutPwdDto> result = userService.updateUser(userDto, LOSER_TOKEN);

        verify(usersRepository, never()).checkIfEmailExist(anyString());
        verify(usersRepository, never()).findUserByUuid(any());

        assertTrue(result.isLeft());
        assertEquals(401, result.getLeft().getCode());
        assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 200 response code with a List<UserDto>")
    void testGetUsers() {
        final User user = User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        final UserDto userDto = UserDto.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        List<User> userList = new ArrayList<>();
        userList.add(user);

        given(usersRepository.findAll()).willReturn(userList);
        given(modelMapper.map(any(), eq(UserDto.class))).willReturn(userDto);
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, List<UserDto>> result = userService.getUsers(ADMIN_TOKEN);

        assertTrue(result.isRight());
        assertEquals( userDto, result.get().get(0));
    }

    @Test
    @DisplayName("Should return a 401 response code if the user does not have the admin role")
    void testGetUsersNotAdmin() {

        given(jwtService.isAdmin(anyString())).willReturn(false);

        final Either<ErrorResponseMessage, List<UserDto>> result = userService.getUsers(LOSER_TOKEN);

        verify(usersRepository, never()).findAll();
        verify(modelMapper, never()).map(any(), anyString());

        assertTrue(result.isLeft());
        assertEquals(401, result.getLeft().getCode());
        assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 404 not found response code if there are no users")
    void testGetUsersErrorNotFound() {
        given(usersRepository.findAll()).willReturn(Collections.emptyList());
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, List<UserDto>> result = userService.getUsers(ADMIN_TOKEN);

        assertTrue(result.isLeft());
        assertEquals(404, result.getLeft().getCode());
        assertEquals(USER_NOT_FOUND, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 200 response code if a user is retrieved")
    void testGetUserById() {
        final User user = User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();
        final UserDto userDto = UserDto.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        given(usersRepository.findUserByUuid(any())).willReturn(Optional.of(user));
        given(modelMapper.map(any(), eq(UserDto.class))).willReturn(userDto);
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, UserDto> result = userService.getUserById(user.getUuid(), ADMIN_TOKEN);

        assertTrue(result.isRight());
        assertEquals(userDto, result.get());
    }

    @Test
    @DisplayName("Should return a 401 response code if the user does not have the admin role")
    void testGetUserNotAdmin() {
        final User user = User.builder()
                .uuid(USER_UUID)
                .username(USERNAME)
                .email(USER_EMAIL)
                .firstName(FIRST_NAME)
                .lastName(LAST_NAME)
                .password(PASSWORD)
                .role(RoleEnum.ADMIN)
                .build();

        given(jwtService.isAdmin(anyString())).willReturn(false);

        final Either<ErrorResponseMessage, UserDto> result = userService.getUserById(user.getUuid(), LOSER_TOKEN);

        verify(usersRepository, never()).findUserByUuid(any());
        verify(modelMapper, never()).map(any(), anyString());

        assertTrue(result.isLeft());
        assertEquals(401, result.getLeft().getCode());
        assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 200 response code if a user is retrieved")
    void testGetUserByIdErrorNotFound() {
        given(usersRepository.findUserByUuid(any())).willReturn(Optional.empty());
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, UserDto> result = userService.getUserById(UUID.randomUUID(), ADMIN_TOKEN);

        assertTrue(result.isLeft());
        assertEquals(404, result.getLeft().getCode());
        assertEquals(USER_NOT_FOUND, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 204 response code when given users are deleted")
    void testDeleteUsers() {
        List<UUID> userList = new ArrayList<>();
        userList.add(UUID.randomUUID());
        userList.add(UUID.randomUUID());

        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Optional<ErrorResponseMessage> result = userService.deleteUser(userList, ADMIN_TOKEN);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should return a 401 response code if the user does not have admin role")
    void testDeleteUsersNotAdmin() {
        List<UUID> userList = new ArrayList<>();
        userList.add(UUID.randomUUID());
        userList.add(UUID.randomUUID());

        given(jwtService.isAdmin(anyString())).willReturn(false);

        final Optional<ErrorResponseMessage> result = userService.deleteUser(userList, LOSER_TOKEN);

        verify(usersRepository, never()).deleteAllByUuid(anyList());

        assertTrue(result.isPresent());
        assertEquals(401, result.get().getCode());
        assertEquals(ROLE_ADMIN_MANDATORY, result.get().getMessage());
    }

    @Test
    @DisplayName("Should return a 400 bad request response code when there an empty id or name in user given")
    void testDeleteUsersErrorIfIdEmpty() {
        List<UUID> userList = new ArrayList<>();
        userList.add(null);

        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Optional<ErrorResponseMessage> result = userService.deleteUser(userList, ADMIN_TOKEN);

        assertTrue(result.isEmpty());
    }
}
