package com.epitech.cryptoProject.data;

import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "coins", uniqueConstraints = @UniqueConstraint(name = "coins_name_uk", columnNames = "name"))
public class Coin {

  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  @Column(name = "id", updatable = false, nullable = false)
  private Integer id;
  private String name;
}
