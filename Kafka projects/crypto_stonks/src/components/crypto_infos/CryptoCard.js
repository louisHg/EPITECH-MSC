import { useState, useEffect } from "react"
import { REQUEST_STATE } from "../../helpers/requestState"
import Error from "../error/Error"
import moment from "moment"
import 'moment/locale/fr'
import axios from "axios"
import Chart from "../charts/Chart"
import { ColorRing } from "react-loader-spinner"



export default function CryptoCard({ symbol, troll_mode }) {

    const [crypto_info, setCryptoInfo] = useState({})
    const [request_state, setRequestState] = useState(REQUEST_STATE.LOADING)

    useEffect(() => {
        getCoinInfo()
        const interval = setInterval(getCoinInfo, 10000)
        return () => clearInterval(interval)
    }, [symbol]);


    function getNearestDateItem(items, target) {
        if (!target) {
            target = Date.now()
        } else if (target instanceof Date) {
            target = target.getTime()
        }

        var nearest = Infinity
        var winner = -1

        items.forEach(function (item, index) {
            let date = item.date
            if (date instanceof Date) {
                date = item.date.getTime()
            }
            else {
                date = Date.parse(date)
            }
            let distance = Math.abs(date - target)
            if (distance < nearest) {
                nearest = distance
                winner = index
            }
        })

        return items[winner]
    }


    const getCoinInfo = () => {
        axios.get(`http://localhost:1180/crypto/byAssetShortName/${symbol}`)
            .then((resp) => {
                let latest_item = resp.data.cryptoDataList[0]

                const day_ago = new Date()
                day_ago.setDate(day_ago.getDate() - 1)

                let data_day_ago = getNearestDateItem(resp.data.cryptoDataList, day_ago)

                const week_ago = new Date()
                week_ago.setDate(week_ago.getDate() - 7)
                let data_week_ago = getNearestDateItem(resp.data.cryptoDataList, week_ago)

                console.log(data_day_ago)
                console.log(data_week_ago)

                let price_diff_24h = null
                let price_evolution_24h = null

                let price_diff_7_days = null
                let price_evolution_7_days = null

                if (data_day_ago) {
                    price_diff_24h = latest_item.currentPrice - data_day_ago.currentPrice
                    price_evolution_24h = Math.trunc(((latest_item.currentPrice - data_day_ago.currentPrice) / data_day_ago.currentPrice * 10000)) / 100
                }
                if (data_week_ago) {
                    price_diff_7_days = latest_item.currentPrice - data_week_ago.currentPrice
                    price_evolution_7_days = Math.trunc(((latest_item.currentPrice - data_week_ago.currentPrice) / data_week_ago.currentPrice * 10000)) / 100
                }

                console.log()

                let sparkline = resp.data.cryptoDataList.map((item) => { return { date: moment(item.date), price: item.currentPrice } }).reverse()
                let only_price = resp.data.cryptoDataList.map((item) => item.currentPrice)
                let ath = Math.max(...only_price)
                let min = Math.min(...only_price)

                setCryptoInfo({
                    current_price: latest_item.currentPrice,
                    symbol: latest_item.cryptoAssetShortName,
                    full_name: latest_item.cryptoName,
                    ath: ath,
                    min: min,
                    price_diff_24h: price_diff_24h,
                    price_evolution_24h: price_evolution_24h,
                    price_diff_7_days: price_diff_7_days,
                    price_evolution_7_days: price_evolution_7_days,
                    sparkline: sparkline.map((item) => { return { date: moment(item.date).format('L'), price: item.price } })
                })

                setRequestState(REQUEST_STATE.SUCCESS)
            })
            .catch((_) => {
                console.log(_)
                setRequestState(REQUEST_STATE.ERROR)
            })
    }

    const renderPriceDiff = (price_diff, label) => {
        if (price_diff > 0) return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="green-text">
                {price_diff} €
            </div>
        </div>

        if (price_diff <= 0) return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="red-text">
                {price_diff} €
            </div>
        </div>



        return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="grey-text">
                Erreur lors du calcul
            </div>
        </div>

    }

    const renderPriceEvolution = (evolution_rate, label) => {
        if (evolution_rate > 0) return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="green-text">
                {evolution_rate} %
            </div>
        </div>

        if (evolution_rate <= 0) return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="red-text">
                {evolution_rate} %
            </div>
        </div>

        return <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
            <div>{label}</div>
            <div className="grey-text">
                Erreur lors du calcul
            </div>
        </div>


    }


    if (request_state === REQUEST_STATE.LOADING) return <ColorRing visible height={80} width={80} colors={["#e15b64", "#e15b64", "#e15b64", "#e15b64", "#e15b64"]} />
    if (request_state === REQUEST_STATE.ERROR) return <Error TROLL_MODE={troll_mode} />

    return <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="container card">

            <div className="card-content grey lighten-4">
                <div className="card-title">{crypto_info.full_name}</div>
                <div><Chart sparkline={crypto_info.sparkline} /></div>
                <div>
                    <div style={{ display: "flex", alignContent: "center", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
                            <div>Prix actuel:</div> {crypto_info.current_price} €
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
                            <div>Maximum enregistré:</div> {crypto_info.ath} €
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: 5 }}>
                            <div>Minimum enregistré: </div>{crypto_info.min} €
                        </div>
                        {renderPriceDiff(crypto_info.price_diff_24h, "Différence sur 24h: ")}
                        {renderPriceEvolution(crypto_info.price_evolution_24h, "Taux d'évolution sur 24h")}
                        {renderPriceDiff(crypto_info.price_diff_7_days, "Différence sur 7 jours: ")}
                        {renderPriceEvolution(crypto_info.price_evolution_7_days, "Taux d'évolution sur une semaine:")}
                    </div>

                </div>
            </div>
        </div>
    </div>

}