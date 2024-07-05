package com.epitech.cryptoProject.controllers;

import static com.epitech.cryptoProject.controllers.JsonMapperControllerTest.objectMapper;
import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_ARTICLE_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_ARTICLE_FOUND;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epitech.cryptoProject.dtos.ArticleDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.services.ArticleService;
import java.util.List;
import java.util.Optional;
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
class ArticleControllerTest {

  @Autowired
  protected MockMvc mockMvc;

  @MockBean
  private ArticleService articleService;

  private final String ARTICLE_ENDPOINT = "/articles";

  private final Integer ARTICLE_ID_1 = 1;
  private final Integer ARTICLE_ID_2 = 2;
  private final String ARTICLE_NAME_VDN = "la voix du nord";
  private final String ARTICLE_URL_VDN = "lavoixdunord.fr";
  private final String ARTICLE_NAME_LM = "le monde";
  private final String ARTICLE_URL_LM = "lemonde.fr";

  private final ArticleDto ARTICLE_DTO = ArticleDto.builder().id(ARTICLE_ID_1).url(ARTICLE_URL_VDN).name(ARTICLE_NAME_VDN).build();
  private final ArticleDto SECOND_ARTICLE_DTO = ArticleDto.builder().id(ARTICLE_ID_2).url(ARTICLE_URL_LM).name(ARTICLE_NAME_LM).build();

  @Test
  @DisplayName("Should return a 201 response code when articles were been saved")
  void testSaveArticles() throws Exception {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(articleService.saveArticles(any(), anyString())).willReturn(right(articleDtoList));

    mockMvc.perform(post(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(articleDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$[0].id").value(ARTICLE_ID_1))
        .andExpect(jsonPath("$[0].name").value(ARTICLE_NAME_VDN))
        .andExpect(jsonPath("$[0].url").value(ARTICLE_URL_VDN))
        .andExpect(jsonPath("$[1].id").value(ARTICLE_ID_2))
        .andExpect(jsonPath("$[1].url").value(ARTICLE_URL_LM))
        .andExpect(jsonPath("$[1].name").value(ARTICLE_NAME_LM));
  }

  @Test
  @DisplayName("Should return a 400 response code if article id is null")
  void testSaveArticlesErrorIdEmpty() throws Exception {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(articleService.saveArticles(any(), anyString())).willReturn(left(ErrorResponseMessage.of(400, BAD_ARTICLE_GIVEN)));

    mockMvc.perform(post(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(articleDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(HttpStatus.BAD_REQUEST.value()))
        .andExpect(jsonPath("$.message").value(BAD_ARTICLE_GIVEN));
  }

  @Test
  @DisplayName("Should return a 200 response code when articles are successfully retrieved")
  void testGetArticles() throws Exception {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(articleService.getArticles()).willReturn(right(articleDtoList));

    mockMvc.perform(get(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(ARTICLE_ID_1))
        .andExpect(jsonPath("$[0].name").value(ARTICLE_NAME_VDN))
        .andExpect(jsonPath("$[0].url").value(ARTICLE_URL_VDN))
        .andExpect(jsonPath("$[1].id").value(ARTICLE_ID_2))
        .andExpect(jsonPath("$[1].url").value(ARTICLE_URL_LM))
        .andExpect(jsonPath("$[1].name").value(ARTICLE_NAME_LM));
  }

  @Test
  @DisplayName("Should return a 404 response code when there are no articles saved")
  void testGetArticlesNotFound() throws Exception {
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(404, NO_ARTICLE_FOUND);

    given(articleService.getArticles()).willReturn(left(errorResponseMessage));

    mockMvc.perform(get(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_ARTICLE_FOUND));
  }

  @Test
  @DisplayName("Should return a 200 response code when article with given id is successfully retrieved")
  void testGetArticleById() throws Exception {
    given(articleService.getArticleById(anyInt(), anyString())).willReturn(right(ARTICLE_DTO));

    mockMvc.perform(get(ARTICLE_ENDPOINT + "/" + ARTICLE_ID_1)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(ARTICLE_ID_1))
        .andExpect(jsonPath("$.url").value(ARTICLE_URL_VDN))
        .andExpect(jsonPath("$.name").value(ARTICLE_NAME_VDN));
  }

  @Test
  @DisplayName("Should return a 404 response code when there is no article with the given id")
  void testGetArticleByIdNotFound() throws Exception {
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(404, NO_ARTICLE_FOUND);

    given(articleService.getArticleById(anyInt(), anyString())).willReturn(left(errorResponseMessage));

    mockMvc.perform(get(ARTICLE_ENDPOINT + "/" + ARTICLE_ID_1)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(HttpStatus.NOT_FOUND.value()))
        .andExpect(jsonPath("$.message").value(NO_ARTICLE_FOUND));
  }

  @Test
  @DisplayName("Should return a 204 response code when articles are successfully deleted")
  void testDeleteArticles() throws Exception {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(articleService.deleteArticles(anyList(), anyString())).willReturn(Optional.empty());

    mockMvc.perform(delete(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(articleDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  @DisplayName("Should return a 201 response code when articles were been saved")
  void testDeleteArticlesErrorMessage() throws Exception {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);
    final ErrorResponseMessage errorResponseMessage = ErrorResponseMessage.of(400, BAD_ARTICLE_GIVEN);

    given(articleService.deleteArticles(anyList(), anyString())).willReturn(Optional.of(errorResponseMessage));

    mockMvc.perform(delete(ARTICLE_ENDPOINT)
            .header(HttpHeaders.AUTHORIZATION, ADMIN_TOKEN)
            .content(objectMapper.writeValueAsBytes(articleDtoList))
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(errorResponseMessage.getCode()))
        .andExpect(jsonPath("$.message").value(errorResponseMessage.getMessage()));
  }
}
