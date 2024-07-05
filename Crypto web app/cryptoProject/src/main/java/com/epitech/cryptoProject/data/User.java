package com.epitech.cryptoProject.data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "users_email_uk", columnNames = "email"))
public class User implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID uuid;

  @Enumerated(EnumType.STRING)
  private RoleEnum role;

  private String email;
  private String password;
  private String username;
  private String firstName;
  private String lastName;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
