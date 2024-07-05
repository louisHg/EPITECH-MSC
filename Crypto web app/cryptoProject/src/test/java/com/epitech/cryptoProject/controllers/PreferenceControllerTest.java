package com.epitech.cryptoProject.controllers;

import static com.epitech.cryptoProject.controllers.JsonMapperControllerTest.objectMapper;
import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_PREFERENCES_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_COIN_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_PREFERENCES_FOUND;
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

import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.PreferenceDto;
import com.epitech.cryptoProject.services.PreferenceService;
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
class PreferenceControllerTest {

  @Autowired
  protected MockMvc mockMvc;

  @MockBean
  private PreferenceService preferenceService;

  private final String PREFERENCES_ENDPOINT = "/preferences";

  private final PreferenceDto PREFERENCE_DTO = PreferenceDto.builder().id(1).coinId(1).articleId(1).userId(UUID.randomUUID()).build();

  @Test
  @DisplayName("Should return a 201 response code when preferences were been saved")
  void testSavePreferences() throws Exception {

    given(preferenceService.savePreferences(anyList())).willReturn(right(List.of(PREFERENCE_DTO)));

    mockMvc.perform(post(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(PREFERENCE_DTO)))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$[0].id").value(PREFERENCE_DTO.getId()))
        .andExpect(jsonPath("$[0].coinId").value(PREFERENCE_DTO.getCoinId()))
        .andExpect(jsonPath("$[0].articleId").value(PREFERENCE_DTO.getArticleId()))
        .andExpect(jsonPath("$[0].userId").value(PREFERENCE_DTO.getUserId().toString()));
  }

  @Test
  @DisplayName("Should return a 400 response code if coin id and article id are empty")
  void testSavePreferencesErrorIdEmpty() throws Exception {
    final String errorMessage = BAD_PREFERENCES_GIVEN;

    given(preferenceService.savePreferences(anyList())).willReturn(left(ErrorResponseMessage.of(400, errorMessage)));

    mockMvc.perform(post(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(PREFERENCE_DTO)))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(jsonPath("$.message").value(errorMessage));
  }

  @Test
  @DisplayName("Should return a 200 response code when preferences are successfully retrieved")
  void testGetPreferences() throws Exception {
    given(preferenceService.getAllPreferences(anyString())).willReturn(right(List.of(PREFERENCE_DTO)));

    mockMvc.perform(get(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(PREFERENCE_DTO.getId()))
        .andExpect(jsonPath("$[0].coinId").value(PREFERENCE_DTO.getCoinId()))
        .andExpect(jsonPath("$[0].articleId").value(PREFERENCE_DTO.getArticleId()))
        .andExpect(jsonPath("$[0].userId").value(PREFERENCE_DTO.getUserId().toString()));
  }

  @Test
  @DisplayName("Should return a 404 response code when there are no preferences saved")
  void testGetPreferencesNotFound() throws Exception {
    given(preferenceService.getAllPreferences(anyString())).willReturn(left(ErrorResponseMessage.of(404, NO_COIN_FOUND)));

    mockMvc.perform(get(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_COIN_FOUND));
  }

  @Test
  @DisplayName("Should return a 200 response code when preference with given id is successfully retrieved")
  void testGetPreferenceById() throws Exception {
    given(preferenceService.getPreferencesByUserId(any())).willReturn(right(List.of(PREFERENCE_DTO)));

    mockMvc.perform(get(PREFERENCES_ENDPOINT + "/" + PREFERENCE_DTO.getUserId())
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(PREFERENCE_DTO.getId()))
        .andExpect(jsonPath("$[0].coinId").value(PREFERENCE_DTO.getCoinId()))
        .andExpect(jsonPath("$[0].articleId").value(PREFERENCE_DTO.getArticleId()))
        .andExpect(jsonPath("$[0].userId").value(PREFERENCE_DTO.getUserId().toString()));
  }

  @Test
  @DisplayName("Should return a 404 response code when there is no preference with the given id")
  void testGetPreferenceByIdNotFound() throws Exception {
    given(preferenceService.getPreferencesByUserId(any())).willReturn(left(ErrorResponseMessage.of(404, NO_PREFERENCES_FOUND)));

    mockMvc.perform(get(PREFERENCES_ENDPOINT + "/" + PREFERENCE_DTO.getUserId())
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_PREFERENCES_FOUND));
  }

  @Test
  @DisplayName("Should return a 204 response code when preferences are successfully deleted")
  void testDeletePreferences() throws Exception {
    given(preferenceService.deletePreferences(anyList())).willReturn(Optional.empty());

    mockMvc.perform(delete(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(PREFERENCE_DTO)))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @DisplayName("Should return a 400 response code if there is a problem while deleting preferences")
  void testDeleteCoinsErrorMessage() throws Exception {
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(400, BAD_PREFERENCES_GIVEN + " " + PREFERENCE_DTO);

    given(preferenceService.deletePreferences(anyList())).willReturn(Optional.of(errorResponseMessage));

    mockMvc.perform(delete(PREFERENCES_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(List.of(PREFERENCE_DTO)))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(errorResponseMessage.getCode()))
        .andExpect(jsonPath("$.message").value(errorResponseMessage.getMessage()));
  }
}
