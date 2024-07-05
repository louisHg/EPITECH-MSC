package net.api.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.api.springboot.entite.CryptoData;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssetShortNameWithAllData {

    private String assetShortName;

    private List<CryptoData> cryptoDataList;

}
