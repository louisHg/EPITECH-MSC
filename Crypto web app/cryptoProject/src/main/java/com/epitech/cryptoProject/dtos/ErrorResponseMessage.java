package com.epitech.cryptoProject.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponseMessage {

  private int code;
  private String message;

  public static ErrorResponseMessage of(int code, String message) {
    return new ErrorResponseMessage(code, message);
  }
}
