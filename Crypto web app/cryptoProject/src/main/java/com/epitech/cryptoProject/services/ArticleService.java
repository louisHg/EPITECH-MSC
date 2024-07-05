package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_ARTICLE_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_ARTICLE_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;

import com.epitech.cryptoProject.data.Article;
import com.epitech.cryptoProject.dtos.ArticleDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.repositories.ArticlesRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Slf4j
@Transactional
public class ArticleService {

  private final ArticlesRepository articlesRepository;
  private final ModelMapper modelMapper;
  private final JwtService jwtService;

  public ArticleService(ArticlesRepository articlesRepository, ModelMapper modelMapper, JwtService jwtService) {
    this.articlesRepository = articlesRepository;
    this.modelMapper = modelMapper;
    this.jwtService = jwtService;
  }

  public Either<ErrorResponseMessage, List<ArticleDto>> saveArticles(final List<ArticleDto> articleDtoList, final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<ArticleDto> optionalBadArticleDto = articleDtoList.stream()
        .filter(articleDto -> Objects.isNull(articleDto.getName()) || Objects.isNull(articleDto.getUrl())).findFirst();

    if (optionalBadArticleDto.isPresent()) {
      return left(ErrorResponseMessage.of(400, BAD_ARTICLE_GIVEN));
    }

    final List<Article> articleList = articleDtoList.stream().map(articleDto -> modelMapper.map(articleDto, Article.class))
        .collect(Collectors.toList());

    final List<Article> articlesSaved = articlesRepository.saveAll(articleList);

    final List<ArticleDto> articleDtos = articlesSaved.stream().map(article -> modelMapper.map(article, ArticleDto.class))
        .collect(Collectors.toList());

    return right(articleDtos);
  }

  public Either<ErrorResponseMessage, List<ArticleDto>> getArticles() {
    final List<Article> articleList = articlesRepository.findAll();

    if (articleList.isEmpty()) {
      return left(ErrorResponseMessage.of(404, NO_ARTICLE_FOUND));
    }

    final List<ArticleDto> articleDtoList = articleList.stream().map(article -> modelMapper.map(article, ArticleDto.class))
        .collect(Collectors.toList());

    return right(articleDtoList);
  }

  public Either<ErrorResponseMessage, ArticleDto> getArticleById(final Integer articleId, final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<Article> optionalArticle = articlesRepository.findById(articleId);

    if (optionalArticle.isEmpty()) {
      return left(ErrorResponseMessage.of(404, NO_ARTICLE_FOUND));
    }

    final ArticleDto articleDto = modelMapper.map(optionalArticle.get(), ArticleDto.class);

    return right(articleDto);
  }

  public Optional<ErrorResponseMessage> deleteArticles(final List<ArticleDto> articleDtoList, final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return Optional.of(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    final Optional<ArticleDto> optionalArticleDto = articleDtoList.stream()
        .filter(articleDto -> Objects.isNull(articleDto.getId())).findFirst();

    if (optionalArticleDto.isPresent()) {
      return Optional.of(ErrorResponseMessage.of(400, BAD_ARTICLE_GIVEN + " " + optionalArticleDto.get()));
    }

    final List<Article> articleList = articleDtoList.stream().map(articleDto -> modelMapper.map(articleDto, Article.class))
        .collect(Collectors.toList());

    articlesRepository.deleteAll(articleList);

    return Optional.empty();
  }

  public Optional<ErrorResponseMessage> deleteAllArticles(final String authorization) {
    if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
      return Optional.of(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
    }

    articlesRepository.deleteAllArticles();

    return Optional.empty();
  }
}
