const fs = require("fs")

const { readOneCoin, getTwoHundredBest, getTimeRange } = require("./mongodb/coins")
const { read_time_period_fng } = require("./mongodb/fear_greed_index")
const { readOneUser } = require("./mongodb/users_func")

function tauxEvolutionVS(array, btcArray) {
    var taux = (array[array.length - 1].price - array[0].price) / array[0].price
    var tauxBTC = (btcArray[btcArray.length - 1].price - btcArray[0].price) / btcArray[0].price
    var vsBTC = (1 + taux) / (1 + tauxBTC)

    return Math.round(vsBTC * 10000) / 100
}

function tauxEvolution(array) {
    var flat = array[array.length - 1].price - array[0].price
    var taux = (array[array.length - 1].price - array[0].price) / array[0].price
    return { "percentage": taux, "flat": flat }
}

function tauxEvolutionNoTimestamp(array) {
    var flat = array[array.length - 1] - array[0]
    var taux = (array[array.length - 1] - array[0]) / array[0]
    return { "percentage": taux, "flat": flat }
}

async function priceDiff(client, uuid, target) {

    var day = await getTimeRange(client, uuid, "24h")
    var week = await getTimeRange(client, uuid, "7d")
    var month = await getTimeRange(client, uuid, "30d")
    var year = await getTimeRange(client, uuid, "1y")

    var targetDay = await getTimeRange(client, target, "24h")
    var targetWeek = await getTimeRange(client, target, "7d")
    var targetMonth = await getTimeRange(client, target, "30d")
    var targetYear = await getTimeRange(client, target, "1y")

    var dayDiffVS = tauxEvolutionVS(day, targetDay)
    var weekDiffVS = tauxEvolutionVS(week, targetWeek)
    var monthDiffVS = tauxEvolutionVS(month, targetMonth)
    var yearDiffVS = tauxEvolutionVS(year, targetYear)

    var dayDiff = tauxEvolution(day)
    var weekDiff = tauxEvolution(week)
    var monthDiff = tauxEvolution(month)
    var yearDiff = tauxEvolution(year)

    var diffTarget = {
        "comparingTarget": {
            "comparison": [uuid, target],
            "day": dayDiffVS,
            "week": weekDiffVS,
            "month": monthDiffVS,
            "year": yearDiffVS
        },
        "evolution": {
            "24h": dayDiff,
            "7d": weekDiff,
            "30d": monthDiff,
            "1y": yearDiff
        }
    }

    return diffTarget

}

function ecartType(array) {
    var sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i].price)
    }
    var moyenne = sum / array.length
    var listPow = []

    for (let i = 0; i < array.length; i++) {
        let pow = Math.pow(moyenne - array[i].price, 2)
        listPow.push(pow)
    }
    var sumPow = 0
    for (let i = 0; i < listPow.length; i++) {
        sumPow = listPow[i]
    }
    var moyennePow = sumPow / listPow.length
    var ecartType = Math.sqrt(moyennePow)
    var ecartTypePercent = Math.round(ecartType / moyenne * 10000) / 100

    return { "flat": ecartType, "percentage": ecartTypePercent }
}

function ATH(data) {

    var ath = parseInt(data.allTimeHigh.price)
    var fromATH = ath - parseInt(data.price)
    var percentageFromATH = data.price - ath

    var todate = new Date(data.allTimeHigh.timestamp * 1000).getDate();
    var tomonth = new Date(data.allTimeHigh.timestamp * 1000).getMonth() + 1;
    var toyear = new Date(data.allTimeHigh.timestamp * 1000).getFullYear();
    var dateLastATH = todate + '/' + tomonth + '/' + toyear;

    return { "ATH": ath, "diffFromATH": fromATH, "percentageFromATH": percentageFromATH, "dateOfATH": dateLastATH }
}

function calculateMoyennesMobile(array, window) {
    function somme(array, début, fin) {
        let somme = 0
        for (let j = début; j < fin; ++j) {
            somme += parseInt(array[j].price)
        }
        return somme
    }
    var steps = array.length - window
    var result = []
    for (let i = 0; i < steps; ++i) {
        let sum = somme(array, i, i + window)
        result.push({ "timestamp": array[i].timestamp, "price": sum / window })
    }
    return result
}

async function moyennesMobiles(client, uuid) {
    var year = await getTimeRange(client, uuid, "1y")

    var twenty = calculateMoyennesMobile(year, 20)
    var fifty = calculateMoyennesMobile(year, 50)
    var ninty = calculateMoyennesMobile(year, 90)
    var hundredtwenty = calculateMoyennesMobile(year, 120)

    return {
        "MM20": twenty,
        "MM50": fifty,
        "MM90": ninty,
        "MM120": hundredtwenty
    }
}

function moyenneFnG(array) {
    var total = 0

    for (let i = 0; i < array.length; i++) {
        total += parseInt(array[i].value)
    }

    var moyenne = Math.round(total / array.length)

    if (moyenne > 0 && moyenne <= 25) { var sentiment = "Extreme Fear" } else
        if (moyenne > 25 && moyenne <= 40) { var sentiment = "Fear" } else
            if (moyenne > 40 && moyenne <= 60) { var sentiment = "Moderate" } else
                if (moyenne > 60 && moyenne < 75) { var sentiment = "Greed" } else { var sentiment = "Extreme Greed" }

    return { "moyenne": moyenne, "sentiment": sentiment }
}

async function analysisFnG(client) {
    var day = await read_time_period_fng(client, "24h")
    var week = await read_time_period_fng(client, "7d")
    var month = await read_time_period_fng(client, "30d")
    var year = await read_time_period_fng(client, "1y")

    var FnG = {
        "day": moyenneFnG(day),
        "week": moyenneFnG(week),
        "month": moyenneFnG(month),
        "year": moyenneFnG(year),
    }
    return FnG
}

async function fullSingleCoinData(client, uuid, target = "Qwsogvtv82FCd") {
    var coinData = await readOneCoin(client, uuid)

    var athData = ATH(coinData)
    var ecartTypeData = ecartType(coinData.sparkline)
    var moyenneMobilesData = await moyennesMobiles(client, uuid)
    var priceDiffData = await priceDiff(client, uuid, target)
    var RSIdata = await RSI(client, uuid)

    var response = {
        "type": "FullCoinData",
        "coin": {
            "name": coinData.name,
            "symbol": coinData.symbol,
            "uuid": uuid,
            "description": coinData.description,
            "website": coinData.websiteUrl,
            "icon": coinData.iconUrl
        },
        "data": {
            "marketcap": coinData.marketCap,
            "24hVolume": coinData["24hVolume"],
            "supply": {
                "total": coinData.supply.total,
                "circulating": coinData.supply.circulating
            },
            "currentPrice": coinData.price,
            "btcPrice": coinData.btcPrice,
            "rank": coinData.rank,
            "sparkline": coinData.sparkline,
            "ATH": athData,
            "ecartType": ecartTypeData,
            "moyenneMobiles": moyenneMobilesData,
            "priceDiff": priceDiffData,
            "RSI" : RSIdata
        }

    }

    return response



}

async function allCoins(){
    await getTwoHundredBest()

    var rawData = fs.readFileSync("./data/basicData.json");
    var data = JSON.parse(rawData);
  
    var fullcoins = [];

    for(let i = 0; i < data.length; i++){
        var coin = {
            "rank" : data[i].rank,
            "uuid" : data[i].uuid,
            "symbol" : data[i].symbol,
            "name" : data[i].name,
            "marketCap" : data[i].marketCap,
            "price" : data[i].price,
            "priceDiffInfos" : tauxEvolutionNoTimestamp(data[i].sparkline)
        }
        fullcoins.push(coin)
    }

    return fullcoins

}

function rsiPeriod(array){
    var hausse = []
    var hausseTotale = 0
    var baisse = []
    var baisseTotal = 0
    
    for(let i = 0; i < array.length-1; i++){
        if(array[i+1].price > array[i].price){
            var currentHausse = array[i+1].price - array[i].price
            hausse.push(currentHausse)
            hausseTotale += currentHausse
        }
        else{
            var currentBaisse = array[i+1].price - array[i].price
            baisse.push(currentBaisse)
            baisseTotal += currentBaisse
        }
    }

    var moyenneHausse = hausseTotale / hausse.length
    var moyenneBaisse = baisseTotal / baisse.length

    var RSI = 100 * moyenneHausse / (moyenneHausse - moyenneBaisse)

    if (RSI > 0 && RSI <= 30) { var interpretation = "Over selled" } else
    if (RSI > 30 && RSI <= 50) { var interpretation = "Selling trend" } else
    if (RSI > 50 && RSI <= 70) { var interpretation = "Buying trend" } else
    { var interpretation = "Over bought" }

    return { "RSI" : RSI, "interpretation": interpretation}
}

async function RSI(client, uuid){

    var sevenDays = await getTimeRange(client, uuid ,"7d")
    var forteenDays = await getTimeRange(client, uuid ,"14d")
    var month = await getTimeRange(client, uuid ,"30d")

    var weekRSI = rsiPeriod(sevenDays)
    var TwoWeekRSI = rsiPeriod(forteenDays)
    var monthRSI = rsiPeriod(month)

    var rsiData = {
        "7d" : weekRSI,
        "14d" : TwoWeekRSI,
        "1m" : monthRSI
    }

    return rsiData
}

async function notifcationCalculations(){
    var allCoinsData = fs.readFileSync("./data/basicData.json");
    var allCoinsData = JSON.parse(allCoinsData);

    var favorites = fs.readFileSync("./data/toUpdate.json");
    var favorites = JSON.parse(favorites);

    var notifcationList = []

    for(let i = 0; i < allCoinsData.length; i++){
        if(allCoinsData[i].rank < 11 || favorites.includes(allCoinsData[i].uuid)){
            if(allCoinsData[i].rank < 11){
                if(parseFloat(allCoinsData[i].change) > 15 || parseFloat(allCoinsData[i].change) < -15){
                    if(allCoinsData[i].change > 0){
                        var hausseBaisse = "Hausse"
                    }
                    else{
                        var hausseBaisse = "Baisse"
                    }
                    notifcationList.push({
                        "name":allCoinsData[i].name,
                        "symbol":allCoinsData[i].symbol,
                        "hausseBaisse" : hausseBaisse,
                        "change":allCoinsData[i].change
                    })
                }
            }
            else{
                if(favorites.includes(allCoinsData[i].uuid)){
                    if(parseFloat(allCoinsData[i].change) > 7.5 || parseFloat(allCoinsData[i].change) < -7.5){
                        if(allCoinsData[i].change > 0){
                            var hausseBaisse = "Hausse"
                        }
                        else{
                            var hausseBaisse = "Baisse"
                        }
                        notifcationList.push({
                            "name":allCoinsData[i].name,
                            "symbol":allCoinsData[i].symbol,
                            "hausseBaisse" : hausseBaisse,
                            "change":allCoinsData[i].change
                        })
                    }
                }
            }
        }
    }
    return notifcationList
}

async function userCoinData(client, uuid){

    var user = await readOneUser(client, uuid)
    var transaction = user.transactions

    var rawData = fs.readFileSync("./data/basicData.json");
    var data = JSON.parse(rawData);

    var coinsData = {}
    var total_fiat = 0

    for(coin_id in transaction){

        current_coin =  transaction[coin_id]
        coinsData[coin_id] = {
            "coin_id" : coin_id,
            "transaction_history" : current_coin,
            "transactions_data": transactions_total(current_coin),
            "dca" : DCA(current_coin)
        }
        total_fiat += coinsData[coin_id]["transactions_data"]["in_stock"]
    }

    for(coin_id in transaction){
        transaction[coin_id]["averaged_value"] = coinsData[coin_id]["transactions_data"]["in_stock"] * coinsData[coin_id]["dca"]
        transaction[coin_id]["percentage"] = transaction[coin_id]["current_value"] / total_fiat *100

        for(let i = 0; i < data.length; i++){
            if(coin_id == data.uuid){
                transaction[coin_id]["market_value_of_stock"] = transaction[coin_id]["transactions_data"]["in_stock"] * data.price
                transaction[coin_id]["comparison"] = {
                    "flat_diff": transaction[coin_id]["market_value_of_stock"] - transaction[coin_id]["averaged_value"], 
                    "percentage_diff" : transaction[coin_id]["averaged_value"] / transaction[coin_id]["market_value_of_stock"] * 100
                }
            }
        }
    }

    return coinsData
}

function transactions_total(array){

    var total_achat_fiat = 0
    var total_achat_coin = 0
    var total_vente_fiat = 0
    var total_vente_coin = 0

    for(let i = 0; i < array.length; i++){
        if(array[i].type == "achat"){
            total_achat_coin += array[i]["amount"]
            total_achat_fiat += array[i]["amount"] * array[i]["price"]
        }
        else{
            total_vente_coin += array[i]["amount"]
            total_vente_fiat += array[i]["amount"] * array[i]["price"]
        }
    }
    var en_stock = total_achat_coin - total_vente_coin

    return {
        "sold_data":{
            "total_sell_fiat":total_vente_fiat,
            "total_sell_coin":total_vente_coin
        },
        "buy_data":{
            "total_buy_fiat":total_achat_fiat,
            "total_buy_coin":total_achat_coin
        },
        "in_stock":en_stock
    }
}

function DCA(array){
    array.sort(function (x, y) {return x.timestamp - y.timestamp})
    var test_array = []
    for(let i = 0; i < array.length; i++){
        if(array[i].type == "achat"){
            test_array.push({"quantity":array[i]["amount"], "price":array[i]["price"]})
        }
        else{
            if(test_array[0]["quantity"] - array[i]["amount"] <= 0){
                var to_substract = array[i]["amount"] - test_array[0]["quantity"]

                test_array[1]["quantity"] = test_array[1]["quantity"] - to_substract
                test_array.shift()
            }
            else{
                test_array[0]["quantity"] = test_array[0]["quantity"] - array[i]["amount"]
            }
        }
    }
    var total_coin = 0
    var total_fiat = 0
    for(let i = 0; i < test_array.length; i++){
        total_fiat += test_array[i]["quantity"] * test_array[i]["price"]
        total_coin += test_array[i]["quantity"]
    }
    return total_fiat / total_coin
}


module.exports = {
    priceDiff: priceDiff,
    analysisFnG: analysisFnG,
    moyennesMobiles: moyennesMobiles,
    fullSingleCoinData: fullSingleCoinData,
    allCoins:allCoins,
    notifcationCalculations:notifcationCalculations,
    userCoinData:userCoinData
}