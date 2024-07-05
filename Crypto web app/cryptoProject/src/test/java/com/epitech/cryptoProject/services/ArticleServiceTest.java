package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_ARTICLE_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_ARTICLE_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.epitech.cryptoProject.data.Article;
import com.epitech.cryptoProject.dtos.ArticleDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.repositories.ArticlesRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

  @InjectMocks
  private ArticleService articleService;

  @Mock
  private ArticlesRepository articlesRepository;

  @Mock
  private JwtService jwtService;

  @Mock
  private ModelMapper modelMapper;

  private final Integer ARTICLE_ID_1 = 1;
  private final Integer ARTICLE_ID_2 = 2;
  private final String ARTICLE_NAME_VDN = "la voix du nord";
  private final String ARTICLE_URL_VDN = "lavoixdunord.fr";
  private final String ARTICLE_NAME_LM = "le monde";
  private final String ARTICLE_URL_LM = "lemonde.fr";

  private final Article ARTICLE = Article.builder().id(ARTICLE_ID_1).url(ARTICLE_URL_VDN).name(ARTICLE_NAME_VDN).build();
  private final Article SECOND_ARTICLE = Article.builder().id(ARTICLE_ID_2).url(ARTICLE_URL_LM).name(ARTICLE_NAME_LM).build();

  private final ArticleDto ARTICLE_DTO = ArticleDto.builder().id(ARTICLE_ID_1).url(ARTICLE_URL_VDN).name(ARTICLE_NAME_VDN).build();
  private final ArticleDto SECOND_ARTICLE_DTO = ArticleDto.builder().id(ARTICLE_ID_2).url(ARTICLE_URL_LM).name(ARTICLE_NAME_LM).build();

  @Test
  @DisplayName("Should return a 201 response code when given articles had been saved")
  void testSaveArticles() {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);
    final List<Article> articleList = List.of(ARTICLE, SECOND_ARTICLE);

    given(jwtService.isAdmin(anyString())).willReturn(true);
    given(modelMapper.map(any(), eq(Article.class))).willReturn(ARTICLE, SECOND_ARTICLE);
    given(articlesRepository.saveAll(anyList())).willReturn(articleList);
    given(modelMapper.map(any(), eq(ArticleDto.class))).willReturn(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    final Either<ErrorResponseMessage, List<ArticleDto>> result = articleService.saveArticles(articleDtoList, ADMIN_TOKEN);

    assertTrue(result.isRight());
    assertEquals(ARTICLE_DTO, result.get().get(0));
    assertEquals(SECOND_ARTICLE_DTO, result.get().get(1));
  }

  @Test
  @DisplayName("Should return a 401 response code when user is not an Admin")
  void testSaveArticlesNotAdmin() {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(false);

    final Either<ErrorResponseMessage, List<ArticleDto>> result = articleService.saveArticles(articleDtoList, ADMIN_TOKEN);

    assertTrue(result.isLeft());
    assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
    assertEquals(401, result.getLeft().getCode());
  }

  @Test
  @DisplayName("Should return a 400 bad request response code when there is an empty id in articles given")
  void testSaveArticlesErrorIfIdEmpty() {
    final ArticleDto articleDtoEmpty = ArticleDto.builder().build();
    final List<ArticleDto> articleDtoList = List.of(articleDtoEmpty, SECOND_ARTICLE_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Either<ErrorResponseMessage, List<ArticleDto>> result = articleService.saveArticles(articleDtoList, ADMIN_TOKEN);

    assertTrue(result.isLeft());
    assertEquals(HttpStatus.BAD_REQUEST.value(), result.getLeft().getCode());
    assertEquals(BAD_ARTICLE_GIVEN, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 200 response code with a List<ArticleDto>")
  void testGetArticles() {
    final List<Article> articleList = List.of(ARTICLE, SECOND_ARTICLE);

    given(articlesRepository.findAll()).willReturn(articleList);
    given(modelMapper.map(any(), eq(ArticleDto.class))).willReturn(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    final Either<ErrorResponseMessage, List<ArticleDto>> result = articleService.getArticles();

    assertTrue(result.isRight());
    assertEquals(ARTICLE_DTO, result.get().get(0));
    assertEquals(SECOND_ARTICLE_DTO, result.get().get(1));
  }

  @Test
  @DisplayName("Should return a 404 not found response code if there are no articles")
  void testGetArticlesErrorNotFound() {
    given(articlesRepository.findAll()).willReturn(Collections.emptyList());

    final Either<ErrorResponseMessage, List<ArticleDto>> result = articleService.getArticles();

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(NO_ARTICLE_FOUND, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 200 response code if an article is retrieved")
void testGetArticleById() {
    given(articlesRepository.findById(any())).willReturn(Optional.of(ARTICLE));
    given(modelMapper.map(any(), eq(ArticleDto.class))).willReturn(ARTICLE_DTO);
    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Either<ErrorResponseMessage, ArticleDto> result = articleService.getArticleById(ARTICLE_ID_1, ADMIN_TOKEN);

    assertTrue(result.isRight());
    assertEquals(ARTICLE_DTO, result.get());
  }

  @Test
  @DisplayName("Should return a 404 not found response code if there is no article with the given id")
  void testGetArticleByIdErrorNotFound() {
    given(articlesRepository.findById(any())).willReturn(Optional.empty());
    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Either<ErrorResponseMessage, ArticleDto> result = articleService.getArticleById(ARTICLE_ID_1, ADMIN_TOKEN);

    assertTrue(result.isLeft());
    assertEquals(404, result.getLeft().getCode());
    assertEquals(NO_ARTICLE_FOUND, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 401 if the user is not an Admin")
  void testGetArticleNotAdmin() {
    given(jwtService.isAdmin(anyString())).willReturn(false);

    final Either<ErrorResponseMessage, ArticleDto> result = articleService.getArticleById(ARTICLE_ID_1, ADMIN_TOKEN);

    verify(articlesRepository, never()).findById(any());
    verify(jwtService, times(1)).isAdmin(anyString());

    assertTrue(result.isLeft());
    assertEquals(401, result.getLeft().getCode());
    assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
  }

  @Test
  @DisplayName("Should return a 204 response code when given articles are deleted")
  void testDeleteArticles() {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Optional<ErrorResponseMessage> result = articleService.deleteArticles(articleDtoList, ADMIN_TOKEN);

    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("Should return a 401 if the user is not an admin")
  void testDeleteArticlesNotAdmin() {
    final List<ArticleDto> articleDtoList = List.of(ARTICLE_DTO, SECOND_ARTICLE_DTO);

    given(jwtService.isAdmin(anyString())).willReturn(false);

    final Optional<ErrorResponseMessage> result = articleService.deleteArticles(articleDtoList, ADMIN_TOKEN);

    verify(jwtService, times(1)).isAdmin(anyString());

    assertTrue(result.isPresent());
    assertEquals(401, result.get().getCode());
    assertEquals(ROLE_ADMIN_MANDATORY, result.get().getMessage());
  }

  @Test
  @DisplayName("Should return a 400 bad request response code when there an empty id or name in article given")
  void testDeleteArticlesErrorIfIdEmpty() {
    final ArticleDto articleDtoEmpty = ArticleDto.builder().build();
    final List<ArticleDto> articleDtoList = List.of(articleDtoEmpty, SECOND_ARTICLE_DTO);
    final String errorMessage = BAD_ARTICLE_GIVEN + " " + articleDtoEmpty;

    given(jwtService.isAdmin(anyString())).willReturn(true);

    final Optional<ErrorResponseMessage> result = articleService.deleteArticles(articleDtoList, ADMIN_TOKEN);

    assertTrue(result.isPresent());
    assertEquals(HttpStatus.BAD_REQUEST.value(), result.get().getCode());
    assertEquals(errorMessage, result.get().getMessage());
  }
}
