package com.selenium.demo.entite;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CryptoData {

    private String cryptoName;
    private String cryptoAssetShortName;
    private String currentPrice;
    private String cryptoMarketCapitalization;
    private String cryptoEuroTradedThisDay;
    private String cryptoCoinTradedThisDay;
    private String cryptoCoinInCirculation;

}
