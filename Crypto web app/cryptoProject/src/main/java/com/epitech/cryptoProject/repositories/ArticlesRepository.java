package com.epitech.cryptoProject.repositories;

import com.epitech.cryptoProject.data.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface ArticlesRepository extends JpaRepository<Article, Integer> {
    @Modifying
    @Query("delete from Article ")
    void deleteAllArticles();
}
