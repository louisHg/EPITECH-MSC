package com.epitech.cryptoProject.controllers;

import static com.epitech.cryptoProject.controllers.JsonMapperControllerTest.objectMapper;
import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_USER_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.EMAIL_FIELD_MANDATORY;
import static com.epitech.cryptoProject.utils.ConstantsMessages.USER_NOT_FOUND;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epitech.cryptoProject.data.RoleEnum;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.UserDto;
import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import com.epitech.cryptoProject.services.UserService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

  @Autowired
  protected MockMvc mockMvc;

  @MockBean
  private UserService userService;

  private final String USER_ENDPOINT = "/user";
  private final String UPDATE_USER_ENDPOINT = "/updateUser";

  private final UserDto USER_DTO = UserDto.builder()
      .uuid(UUID.randomUUID())
      .firstName("toto")
      .lastName("tutu")
      .password("azertyui")
      .role(RoleEnum.ADMIN)
      .username("username")
      .email("toto@epitech.eu")
      .build();
  private final UserWithoutPwdDto USER_WITHOUT_PWD = UserWithoutPwdDto.builder()
      .firstName("toto")
      .lastName("tutu")
      .role(RoleEnum.ADMIN)
      .username("username")
      .email("toto@epitech.eu")
      .build();

  @Test
  @DisplayName("Should return a 201 response code when user has been updated")
  void testUpdateUser() throws Exception {

    given(userService.updateUser(any(), anyString())).willReturn(right(USER_WITHOUT_PWD));

    mockMvc.perform(post(USER_ENDPOINT + UPDATE_USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(USER_DTO))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.firstName").value(USER_DTO.getFirstName()))
        .andExpect(jsonPath("$.lastName").value(USER_DTO.getLastName()))
        .andExpect(jsonPath("$.email").value(USER_DTO.getEmail()))
        .andExpect(jsonPath("$.role").value(USER_DTO.getRole().toString()))
        .andExpect(jsonPath("$.username").value(USER_DTO.getUsername()));
  }

  @Test
  @DisplayName("Should return a 400 response code if user email is not given")
  void testUpdateUserEmailEmpty() throws Exception {
    final String errorMessage = EMAIL_FIELD_MANDATORY;

    given(userService.updateUser(any(), anyString())).willReturn(left(ErrorResponseMessage.of(400, errorMessage)));

    mockMvc.perform(post(USER_ENDPOINT + UPDATE_USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(USER_DTO))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(jsonPath("$.message").value(errorMessage));
  }

  @Test
  @DisplayName("Should return a 200 response code when users are successfully retrieved")
  void testGetUsers() throws Exception {

    given(userService.getUsers(anyString())).willReturn(right(List.of(USER_DTO)));

    mockMvc.perform(get(USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(USER_DTO))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].firstName").value(USER_DTO.getFirstName()))
        .andExpect(jsonPath("$[0].lastName").value(USER_DTO.getLastName()))
        .andExpect(jsonPath("$[0].email").value(USER_DTO.getEmail()))
        .andExpect(jsonPath("$[0].role").value(USER_DTO.getRole().toString()))
        .andExpect(jsonPath("$[0].username").value(USER_DTO.getUsername()));
  }

  @Test
  @DisplayName("Should return a 404 response code when there are no users saved")
  void testGetUsersNotFound() throws Exception {
    given(userService.getUsers(anyString())).willReturn(left(ErrorResponseMessage.of(404, USER_NOT_FOUND)));

    mockMvc.perform(get(USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(USER_NOT_FOUND));
  }

  @Test
  @DisplayName("Should return a 200 response code when user with given uuid is successfully retrieved")
  void testGetUserById() throws Exception {
    given(userService.getUserById(any(), anyString())).willReturn(right(USER_DTO));

    mockMvc.perform(get(USER_ENDPOINT + "/" + USER_DTO.getUuid())
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.uuid").value(USER_DTO.getUuid().toString()))
        .andExpect(jsonPath("$.email").value(USER_DTO.getEmail()));
  }

  @Test
  @DisplayName("Should return a 404 response code when there is no user with the given uuid")
  void testGetUserByIdNotFound() throws Exception {
    given(userService.getUserById(any(), anyString())).willReturn(left(ErrorResponseMessage.of(404, USER_NOT_FOUND)));

    mockMvc.perform(get(USER_ENDPOINT + "/" + USER_DTO.getUuid())
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(USER_NOT_FOUND));
  }

  @Test
  @DisplayName("Should return a 204 response code when users are successfully deleted")
  void testDeleteCoins() throws Exception {
    given(userService.deleteUser(anyList(), anyString())).willReturn(Optional.empty());

    mockMvc.perform(delete(USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(USER_DTO.getUuid())))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @DisplayName("Should return a 400 response code when given users informations are not good")
  void testDeleteUsersErrorMessage() throws Exception {
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(400, BAD_USER_GIVEN + " " + USER_DTO.getUuid());

    given(userService.deleteUser(anyList(), anyString())).willReturn(Optional.of(errorResponseMessage));

    mockMvc.perform(delete(USER_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(USER_DTO.getUuid())))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(errorResponseMessage.getCode()))
        .andExpect(jsonPath("$.message").value(errorResponseMessage.getMessage()));
  }
}
