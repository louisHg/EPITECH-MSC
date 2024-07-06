package net.api.springboot.service.implementation;

import lombok.RequiredArgsConstructor;
import net.api.springboot.dto.AssetShortNameWithAllData;
import net.api.springboot.entite.CryptoData;
import net.api.springboot.repository.CryptoDataRepository;
import net.api.springboot.service.CryptoService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CryptoServiceImpl implements CryptoService {

    private final CryptoDataRepository cryptoDataRepository;

    @Override
    public List<CryptoData> getAllCryptoByDateDesc() {
        return cryptoDataRepository.findAllByOrderByDateDesc();
    }

    @Override
    public List<AssetShortNameWithAllData> assetShortNameWithAllDataByDateDesc() {
        List<AssetShortNameWithAllData> assetShortNameWithAllData = new ArrayList<>();

        List<String> assetShortNameList = cryptoDataRepository.findAllAssetShortName();
        assetShortNameList.forEach(asset -> {
            AssetShortNameWithAllData assetData = new AssetShortNameWithAllData();
            assetData.setAssetShortName(asset);
            assetData.setCryptoDataList(cryptoDataRepository.findAllByDateDescAndAssetShortName(asset));
            assetShortNameWithAllData.add(assetData);
        });

        return assetShortNameWithAllData;
    }

    @Override
    public AssetShortNameWithAllData byAssetShortName(String asset) {
        AssetShortNameWithAllData assetData = new AssetShortNameWithAllData();
        assetData.setAssetShortName(asset);
        assetData.setCryptoDataList(cryptoDataRepository.findAllByDateDescAndAssetShortName(asset));
        return assetData;
    }

    @Override
    public List<CryptoData> getLastCrypto() {
        return cryptoDataRepository.getLastCrypto();
    }
}
