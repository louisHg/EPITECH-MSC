package net.api.springboot.controller;

import lombok.RequiredArgsConstructor;
import net.api.springboot.dto.AssetShortNameWithAllData;
import net.api.springboot.entite.CryptoData;
import net.api.springboot.service.CryptoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/crypto")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "Requestor-Type", exposedHeaders = "X-Get-Header")
public class CryptoController {

    private final CryptoService cryptoService;

    @GetMapping
    public List<CryptoData> getAllCryptoByDateDesc(){
        return cryptoService.getAllCryptoByDateDesc();
    }

    @GetMapping("/byAssetShortName")
    public List<AssetShortNameWithAllData> assetShortNameWithAllDataByDateDesc(){
        return cryptoService.assetShortNameWithAllDataByDateDesc();
    }

    @GetMapping("/byAssetShortName/{assetName}")
    public AssetShortNameWithAllData byAssetShortName(@PathVariable String assetName){
        return cryptoService.byAssetShortName(assetName);
    }

    @GetMapping("/lastCrypto")
    public List<CryptoData> getLastCrypto(){
        return cryptoService.getLastCrypto();
    }

}
