package net.api.springboot.service;

import net.api.springboot.dto.AssetShortNameWithAllData;
import net.api.springboot.entite.CryptoData;

import java.util.List;

public interface CryptoService {

    List<CryptoData> getAllCryptoByDateDesc();

    List<AssetShortNameWithAllData> assetShortNameWithAllDataByDateDesc();

    AssetShortNameWithAllData byAssetShortName(String asset);

    List<CryptoData> getLastCrypto();
}
