package net.api.springboot.entite;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CryptoData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Accurate for the massive amount of data
    // @Lob
    private String cryptoName;

    private String cryptoAssetShortName;

    private Double currentPrice;

    private Long cryptoMarketCapitalization;

    private Long cryptoEuroTradedThisDay;

    private Long cryptoCoinTradedThisDay;

    private Date date;

    private String sourceImgCoin;

    // Add if necessary a way to automatically setting the date of the moments
}
