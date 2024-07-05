package com.epitech.cryptoProject.repositories;

import com.epitech.cryptoProject.data.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinsRepository extends JpaRepository<Coin, Integer> {
}
