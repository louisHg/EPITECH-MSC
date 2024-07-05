package com.epitech.cryptoProject.repositories;

import com.epitech.cryptoProject.data.Preference;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PreferencesRepository extends JpaRepository<Preference, Integer> {

    Optional<List<Preference>> findPreferenceByUserId(UUID userUuid);

    @Query("SELECT count (articleId) FROM Preference WHERE userId = :uuid AND articleId = :articleId")
    Integer articleExists(@Param("articleId") Integer articleId, @Param("uuid") UUID uuid);

    @Query("SELECT count (coinId) FROM Preference WHERE userId = :uuid AND coinId = :coinId")
    Integer coinExists(@Param("coinId") Integer coinId, @Param("uuid") UUID uuid);

    @Modifying
    @Query("delete from Preference u where u.userId = :uuid and u.id = :preferenceId")
    void deletePreferenceByUuidAndId(@Param("uuid") UUID uuid, @Param("preferenceId") Integer preferenceId);
}
