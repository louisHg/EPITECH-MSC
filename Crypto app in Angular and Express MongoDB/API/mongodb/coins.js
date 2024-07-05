const axios = require("axios");
const fs = require("fs")

async function createCoinData(client, uuid) {

    var date = Date.now() / 1000

    var response = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "?timePeriod=24h", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response = response.data.data.coin
    var response24h = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "/history", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response24h = response24h.data.data.history
    var response7d = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "/history?timePeriod=7d", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response7d = response7d.data.data.history
    var response30d = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "/history?timePeriod=30d", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response30d = response30d.data.data.history
    var response1y = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "/history?timePeriod=1y", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response1y = response1y.data.data.history

    sparkline24h = response24h
    sparkline7d = response7d
    sparkline30d = response30d
    sparkline1y = response1y

    sparkline = sparkline24h.concat(sparkline7d, sparkline30d, sparkline1y)

    response.lastUpdated24h = date

    if (response) {
        response.firstUpdated = date
    }
    else {
        response.lastUpdated = null
    }

    if (response7d) {
        response.lastUpdated7d = date
    }
    else {
        response.lastUpdated7d = null
    }

    if (response30d) {
        response.lastUpdated30d = date
    }
    else {
        response.lastUpdated30d = null
    }

    if (response1y) {
        response.lastUpdated1y = date
    }
    else {
        response.lastUpdated1y = null
    }

    sparkline = new Set(sparkline)
    response.sparkline = Array.from(sparkline)
    await client.db("CryptoDB").collection("Coins").insertOne(response)
}

async function updateCoinData(client, uuid, timeRange) {

    const result = await client.db("CryptoDB").collection("Coins").findOne({
        uuid: uuid
    });


    if (timeRange == "24h" && result.lastUpdated24h > (Date.now() / 1000) - 1200) {
        console.log("skip refresh")
        return
    }

    var response = await axios.get("https://api.coinranking.com/v2/coin/" + uuid + "/history?timePeriod=" + timeRange, { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch(function (err) { throw new Error(err) });
    response = response.data.data.history

    var lastUpdated24h = result.lastUpdated24h
    var lastUpdated7d = result.lastUpdated7d
    var lastUpdated30d = result.lastUpdated30d
    var lastUpdated1y = result.lastUpdated1y

    var sparkline = result.sparkline.concat(response)
    var uniq = {}
    sparkline = sparkline.filter(obj => !uniq[obj.timestamp] && (uniq[obj.timestamp] = true));
    switch (timeRange) {
        case "24h":
            lastUpdated24h = Date.now() / 1000
            break;
        case "7d":
            lastUpdated7d = Date.now() / 1000
            break;
        case "30d":
            lastUpdated30d = Date.now() / 1000
            break;
        case "1y":
            lastUpdated1y = Date.now() / 1000
            break;
        default:
            break;
    }

    sparkline.sort(function (x, y) { return x.timestamp - y.timestamp })
    sparkline = dataAggregation(sparkline)
    sparkline.sort(function (x, y) { return x.timestamp - y.timestamp })

    await client.db("CryptoDB").collection("Coins").updateOne({ uuid: uuid }, { $set: { sparkline: sparkline, lastUpdated24h: lastUpdated24h, lastUpdated7d: lastUpdated7d, lastUpdated30d: lastUpdated30d, lastUpdated1y: lastUpdated1y } });

}

async function readOneCoin(client, uuid) {
    const result = await client.db("CryptoDB").collection("Coins").findOne({ uuid: uuid });
    return result
}

async function getClosestTimeStamp(client, uuid, timestamp) {

    var coinHistory = await readOneCoin(client, uuid)
    coinHistory = coinHistory.sparkline
    var closest = coinHistory.sort((a, b) => Math.abs(timestamp - a.timestamp) - Math.abs(timestamp - b.timestamp))[0];
    return closest
}

async function getTwoHundredBest() {
    try {
        var response = await axios.get("https://api.coinranking.com/v2/coins?limit=100", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch("Erreur 100 best");
        var responsePart2 = await axios.get("https://api.coinranking.com/v2/coins?limit=100&offset=100", { 'x-access-token': 'coinranking125ba24c3d898228bef4ef86ec3fa59f8597c58f8c6c71c2' }).catch("Erreur 100 best");
        var completeResponse = response.data.data.coins.concat(responsePart2.data.data.coins);


        if (response.data) { fs.writeFileSync("./data/basicData.json", JSON.stringify(completeResponse), function () { return }) }
    }
    catch(e){
        console.log(e)
    }
}

async function getTimeRange(client, uuid, timeRange) {
    var coin = await readOneCoin(client, uuid)
    coinHistory = coin.sparkline
    var historyInRange = []
    switch (timeRange) {
        case "24h":
            var maxTimestamp = Date.now() / 1000 - 86400
            break;
        case "7d":
            var maxTimestamp = Date.now() / 1000 - 604800
            break;
        case "14d":
            var maxTimestamp = Date.now() / 1000 - (604800 * 2)
            break;
        case "30d":
            var maxTimestamp = Date.now() / 1000 - 2629743
            break;
        case "1y":
            var maxTimestamp = Date.now() / 1000 - 31556926
            break;

        default:
            break;
    }

    for (let i = 0; i < coinHistory.length; i++) {
        if (coinHistory[i].timestamp >= maxTimestamp) {
            historyInRange.push(coinHistory[i])
        }
    }
    return historyInRange
}

function dataAggregation(array) {

    //Week = every hour
    //Month = every 6h
    //Year = every 1 day
    //All every 1 week

    var dayData = []
    for (let i = 0; i < array.length; i++) {
        if (array[i].timestamp >= (Date.now() / 1000 - 86400)) {
            dayData.push(array[i])
        }
    }

    var currentTimestamp = array[0].timestamp
    var [weekList, monthList, yearList, allList] = createDurationList(currentTimestamp)

    weekList = classifyDataByDate(array, weekList, "7d")
    monthList = classifyDataByDate(array, monthList, "30d")
    yearList = classifyDataByDate(array, yearList, "1y")
    allList = classifyDataByDate(array, allList, "all")

    weekList = moyennePériode(weekList)
    monthList = moyennePériode(monthList)
    yearList = moyennePériode(yearList)
    allList = moyennePériode(allList)

    var newSparkline = dayData.concat(weekList, monthList, yearList, allList)
    newSparkline = filterNaN(newSparkline)

    return newSparkline
}

function createDurationList(baseStamp) {
    var dateNow = Date.now() / 1000

    var oneHour = 3600
    var sixHours = 21600
    var oneDay = 86400
    var oneWeek = 604800

    var minWeekTimestamp = dateNow - 86400
    var maxWeekTimestamp = dateNow - 604800
    var maxMonthTimestamp = dateNow - 2629743
    var maxYearTimestamp = dateNow - 31556926

    var weekList = []
    var monthList = []
    var yearList = []
    var allList = []

    while (baseStamp < maxYearTimestamp) {
        allList.push({ "timestamp": baseStamp, "data": [] })
        baseStamp += oneWeek
    }
    baseStamp = maxYearTimestamp

    while (baseStamp < maxMonthTimestamp) {
        yearList.push({ "timestamp": baseStamp, "data": [] })
        baseStamp += oneDay
    }
    baseStamp = maxMonthTimestamp

    while (baseStamp < maxWeekTimestamp) {
        monthList.push({ "timestamp": baseStamp, "data": [] })
        baseStamp += sixHours
    }
    baseStamp = maxWeekTimestamp

    while (baseStamp < minWeekTimestamp) {
        weekList.push({ "timestamp": baseStamp, "data": [] })
        baseStamp += oneHour
    }

    return [weekList, monthList, yearList, allList]
}

function classifyDataByDate(array, filterArray, date) {

    switch (date) {
        case "7d":
            var duration = 3600
            break;
        case "30d":
            var duration = 21600
            break;
        case "1y":
            var duration = 86400
            break;
        case "all":
            var duration = 604800
            break;

        default:
            break;
    }

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < filterArray.length; j++) {
            if (array[i].timestamp < filterArray[j].timestamp + duration && array[i].timestamp > filterArray[j].timestamp) {
                filterArray[j].data.push(array[i])
            }
        }
    }

    return filterArray
}

function moyennePériode(array) {

    var periode = []

    for (let i = 0; i < array.length; i++) {
        let totalPrice = 0
        let totalTimestamp = 0
        for (let j = 0; j < array[i].data.length; j++) {
            totalPrice += array[i].data[j].price
            totalTimestamp += array[i].data[j].timestamp
        }
        periode.push({ "price": Math.round(totalPrice / array[i].data.length), "timestamp": Math.round(totalTimestamp / array[i].data.length) })
    }
    return periode
}

function filterNaN(array) {
    let filteredSparkline = []
    for (let i = 0; i < array.length; i++) {
        if (Number.isNaN(array[i].price) || Number.isNaN(array[i].timestamp)) {
            continue
        }
        else {
            filteredSparkline.push(array[i])
        }
    }
    return filteredSparkline
}

module.exports = {
    getTwoHundredBest: getTwoHundredBest,
    getClosestTimeStamp: getClosestTimeStamp,
    createCoinData: createCoinData,
    updateCoinData: updateCoinData,
    getTimeRange: getTimeRange,
    readOneCoin: readOneCoin
}