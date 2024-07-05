package com.epitech.cryptoProject.utils;

import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import io.vavr.control.Either;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseWrapper {

  private ResponseWrapper() {
  }

  public static ResponseEntity<?> matchEitherOnGetOrPatch(Either<ErrorResponseMessage, ?> serviceResponse) {
    return serviceResponse.fold(
        errorResponseMessage -> new ResponseEntity(errorResponseMessage,
            HttpStatus.resolve(errorResponseMessage.getCode())),
        ResponseEntity::ok
    );
  }

  public static ResponseEntity<?> matchEitherOnPost(Either<ErrorResponseMessage, ?> serviceResponse) {
    return serviceResponse.fold(
        errorResponseMessage -> new ResponseEntity(errorResponseMessage,
            HttpStatus.resolve(errorResponseMessage.getCode())), body ->
            new ResponseEntity(body, HttpStatus.CREATED)
    );
  }

  public static ResponseEntity<?> matchEitherOnPostForLogin(Either<ErrorResponseMessage, ?> serviceResponse) {
    return serviceResponse.fold(
        errorResponseMessage -> new ResponseEntity(errorResponseMessage,
            HttpStatus.resolve(errorResponseMessage.getCode())), body ->
            new ResponseEntity(body, HttpStatus.OK)
    );
  }

  public static ResponseEntity<?> matchOptionalOnDelete(Optional<ErrorResponseMessage> serviceResponse) {
    if (serviceResponse.isPresent()) {
      return new ResponseEntity(serviceResponse.get(), HttpStatus.resolve(serviceResponse.get().getCode()));
    }
    return new ResponseEntity(HttpStatus.NO_CONTENT);
  }
}
