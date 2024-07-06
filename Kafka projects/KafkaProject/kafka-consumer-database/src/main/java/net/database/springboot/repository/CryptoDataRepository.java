package net.database.springboot.repository;

import net.database.springboot.entite.CryptoData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CryptoDataRepository extends JpaRepository<CryptoData, Long> {
}
