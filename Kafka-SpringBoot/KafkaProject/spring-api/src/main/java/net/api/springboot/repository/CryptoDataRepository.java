package net.api.springboot.repository;

import net.api.springboot.dto.AssetShortNameWithAllData;
import net.api.springboot.entite.CryptoData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CryptoDataRepository extends JpaRepository<CryptoData, Long> {

    // Find all records and order by date in descending order
    List<CryptoData> findAllByOrderByDateDesc();

    @Query(value = "SELECT * FROM crypto_data cd WHERE cd.crypto_asset_short_name = :assetShortName ORDER BY cd.date DESC", nativeQuery = true)
    List<CryptoData> findAllByDateDescAndAssetShortName(@Param("assetShortName") String assetShortName);

    @Query(value = "SELECT cd.crypto_asset_short_name from crypto_data cd limit 99", nativeQuery = true)
    List<String> findAllAssetShortName();

    @Query(value = "SELECT * FROM ( SELECT * FROM crypto_data cd ORDER BY date DESC LIMIT 99 ) AS latest_99 ORDER BY date ASC", nativeQuery = true)
    List<CryptoData> getLastCrypto();

}
