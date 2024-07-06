package net.data.springboot.object;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CryptoData {

    private String cryptoName;

    private String cryptoAssetShortName;

    private Double currentPrice;

    private Long cryptoMarketCapitalization;

    private Long cryptoEuroTradedThisDay;

    private Long cryptoCoinTradedThisDay;

    private String sourceImgCoin;
}
