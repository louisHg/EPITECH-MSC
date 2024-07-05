package com.epitech.cryptoProject.data;

import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "articles", uniqueConstraints = @UniqueConstraint(name = "articles_url_name_uk", columnNames = {"url", "name"}))
public class Article {

  @Id
  @Column(name = "id", updatable = false, nullable = false)
  private Integer id;
  private String url;
  private String name;
}
