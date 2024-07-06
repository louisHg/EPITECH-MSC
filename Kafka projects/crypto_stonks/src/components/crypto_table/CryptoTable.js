import commafy from "../../helpers/commafy"


export default function CryptoTable({ crypto_data, current_page, setActiveCrypto, active_crypto_symbol }) {

    console.log(crypto_data)

    if (!crypto_data) return
    if (!crypto_data.length) return

    return <div className="container" style={{ width: "80%", marginTop: "20px" }}>
        <ul className="collection">
            {crypto_data.map((crypto, index) => {
                let rank = (index + 1) + ((current_page - 1) * 12)
                return (
                    <li key={index} style={{cursor: "pointer"}}>
                        <div className={`collection-item ${active_crypto_symbol === crypto.cryptoAssetShortName ? "active" : ""}`}
                            style={{ display: "flex", justifyContent: "space-between", border: "solid 0.5px lightgrey" }}
                            onClick={() => setActiveCrypto(crypto.cryptoAssetShortName)}
                            >
                            <div style={{ display: "flex", gap: 10, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                <div style={{ marginRight: "15px" }}>{rank}</div>
                                <img style={{ height: 25, width: 25, borderRadius: "50%" }} src={crypto.sourceImgCoin} alt="" />
                                {crypto.cryptoAssetShortName} {crypto.cryptoName}
                            </div>
                            <div style={{ gap: 10, width: "80%", display: "flex" }}>
                                <div style={{ width: "25%" }}>Prix actuel: {commafy(crypto.currentPrice)}€ </div>
                                <div style={{ width: "35%" }}>Capitalisation: {commafy(crypto.cryptoMarketCapitalization)}€</div>
                                <div style={{ width: "40%" }}>Echange sur 24h: {commafy(crypto.cryptoEuroTradedThisDay)}€</div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    </div>

}