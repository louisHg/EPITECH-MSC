package com.epitech.cryptoProject.dtos;

import com.epitech.cryptoProject.data.RoleEnum;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserWithoutPwdDto {
  private UUID uuid;
  private String email;
  private String username;
  private RoleEnum role;
  private String firstName;
  private String lastName;
  private String access_token;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
