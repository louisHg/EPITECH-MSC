package com.epitech.cryptoProject.controllers;

import com.epitech.cryptoProject.dtos.ArticleDto;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.services.ArticleService;
import com.epitech.cryptoProject.utils.ResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/articles")
public class ArticleController {

  private final ArticleService articleService;

  public ArticleController(ArticleService articleService) {
    this.articleService = articleService;
  }

  @PostMapping
  @Operation(description = "Save articles in database")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Articles successfully saved in database"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<List<ArticleDto>> saveArticles(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody List<ArticleDto> articleDtoList) {
    return (ResponseEntity<List<ArticleDto>>) ResponseWrapper.matchEitherOnPost(
        articleService.saveArticles(articleDtoList, authorization));
  }

  @GetMapping
  @Operation(description = "Get all articles")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Articles successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<List<ArticleDto>> getArticles() {
    return (ResponseEntity<List<ArticleDto>>) ResponseWrapper.matchEitherOnGetOrPatch(articleService.getArticles());
  }

  @GetMapping("/{article_id}")
  @Operation(description = "Get article by Id")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Article successfully retrieved"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<ArticleDto> getArticleById(
      @RequestHeader("Authorization") String authorization,
      @PathVariable("article_id") @Parameter(required = true, name = "article_id", description = "Article id",
          example = "1234") Integer articleId) {
    return (ResponseEntity<ArticleDto>) ResponseWrapper.matchEitherOnGetOrPatch(
        articleService.getArticleById(articleId, authorization));
  }

  @DeleteMapping
  @Operation(description = "Delete articles in database")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Articles successfully deleted in database"),
      @ApiResponse(responseCode = "500",
          description = "An error occurred. for the given parameters, Please check the body return for further information.",
          content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
      )
  })
  public ResponseEntity<?> deleteArticles(
      @RequestHeader("Authorization") String authorization,
      @Valid @RequestBody List<ArticleDto> articleDtoList) {
    return ResponseWrapper.matchOptionalOnDelete(articleService.deleteArticles(articleDtoList, authorization));
  }
  @DeleteMapping("/deleteAll")
  @Operation(description = "Delete all articles in database")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "204", description = "Articles successfully deleted in database"),
          @ApiResponse(responseCode = "500",
                  description = "An error occurred. for the given parameters, Please check the body return for further information.",
                  content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
          )
  })
  public ResponseEntity<?> deleteAllArticles(
          @RequestHeader("Authorization") String authorization) {
    return ResponseWrapper.matchOptionalOnDelete(articleService.deleteAllArticles(authorization));
  }
}
