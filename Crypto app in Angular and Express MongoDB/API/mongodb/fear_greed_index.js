const axios = require("axios");

async function get_today_market_data(client) {

    var marketData = await axios.get("https://api.alternative.me/v2/global/").catch(function (err) { throw new Error(err) })
    var fear_and_greed = await axios.get("https://api.alternative.me/fng/").catch(function (err) { throw new Error(err) })

    var timestamp = marketData.data.metadata
    marketData = marketData.data.data
    fear_and_greed = fear_and_greed.data.data[0]
    var fullMarketData = {
        "active_cryptocurrencies": marketData.active_cryptocurrencies,
        "active_markets": marketData.active_markets,
        "bitcoin_percentage_marketcap": marketData.bitcoin_percentage_of_market_cap,
        "total_market_cap": marketData.quotes.USD.total_market_cap,
        "total_volume_24h": marketData.quotes.USD.total_volume_24h,
        "timestamp": timestamp,
        "fear_greed": {
            "value": parseInt(fear_and_greed.value),
            "classification": fear_and_greed.value_classification
        }
    }
    var fear_and_greed_only = {
        "timestamp" : fear_and_greed.timestamp,
        "value": parseInt(fear_and_greed.value),
        "classification": fear_and_greed.value_classification
    }

    await client.db("CryptoDB").collection("FearGreedIndex").insertOne(fear_and_greed_only)
    await client.db("CryptoDB").collection("MarketInfos").insertOne(fullMarketData)
}

async function read_today_market_data(client){
    var now = Date.now()/1000
    const result = await client.db("CryptoDB").collection("MarketInfos").find({}).toArray()
    var closest = result.sort((a, b) => Math.abs(now - a.timestamp) - Math.abs(now - b.timestamp))[0];
    return closest
}

async function get_year_greed_fear_index(client){
    var fear_and_greed = await axios.get("https://api.alternative.me/fng/?limit=365").catch(function (err) { throw new Error(err) })
    fear_and_greed = fear_and_greed.data.data
    var docList = []
    var unused = []

    for(let i = 0; i < fear_and_greed.length; i++){
        docList.push({
            "timestamp" : fear_and_greed[i].timestamp,
            "value": parseInt(fear_and_greed[i].value),
            "classification": fear_and_greed[i].value_classification
        })
    }
    await client.db("CryptoDB").collection("FearGreedIndex").insertMany(docList)
}

async function read_time_period_fng(client, timeRange){
    const result = await client.db("CryptoDB").collection("FearGreedIndex").find({}).toArray();
    switch (timeRange) {
        case "24h":
            var maxTimestamp = Date.now() / 1000 - 86400
            break;
        case "7d":
            var maxTimestamp = Date.now() / 1000 - 604800
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

    var fngInRange = []
    for (let i = 0; i < result.length; i++) {
        if (result[i].timestamp >= maxTimestamp){
            fngInRange.push(result[i])
        }
    }
    return fngInRange
}

async function getClosestTimeStampFnG(client, timestamp) {
    
    const result = await client.db("CryptoDB").collection("FearGreedIndex").find({}).toArray();
    var closest = result.sort((a, b) => Math.abs(timestamp - a.timestamp) - Math.abs(timestamp - b.timestamp))[0];
    return closest
}

async function getClosestTimeStampMarketData(client, timestamp) {
    
    const result = await client.db("CryptoDB").collection("MarketInfos").find({}).toArray();
    var closest = result.sort((a, b) => Math.abs(timestamp - a.timestamp) - Math.abs(timestamp - b.timestamp))[0];
    return closest
}

async function compareFnG(client){

    var now = Date.now()/1000

    var currentFnG = getClosestTimeStampFnG(client, now)

    var yesterdayFnG = getClosestTimeStampFnG(client, now - 86400)
    var lastWeekFnG = getClosestTimeStampFnG(client, now - 604800)
    var lastMonthFnG = getClosestTimeStampFnG(client, now - 2629743)
    var lastYearFnG = getClosestTimeStampFnG(client, now - 31556926)

    return{
        "today":{
            "value":currentFnG.value,
            "sentiment":currentFnG.classification,
        },

        "yesterday" : {
            "value": yesterdayFnG.value,
            "sentiment" : yesterdayFnG.classification,
            "comparison_today" : currentFnG.value - yesterdayFnG.value,
        },
        "lastWeek" : {
            "value": lastWeekFnG.value,
            "sentiment" : lastWeekFnG.classification,
            "comparison_today" : currentFnG.value - lastWeekFnG.value,
        },
        "lastMonth" : {
            "value": lastMonthFnG.value,
            "sentiment" : lastMonthFnG.classification,
            "comparison_today" : currentFnG.value - lastMonthFnG.value,
        },
        "lastYear" : {
            "value": lastYearFnG.value,
            "sentiment" : lastYearFnG.classification,
            "comparison_today" : currentFnG.value - lastYearFnG.value,
        }
    }
}

async function compareMarketData(client){

    var now = Date.now()/1000

    var currentMarketData = await getClosestTimeStampMarketData(client, now)

    var yesterdayMarket = await getClosestTimeStampMarketData(client, now - 86400)
    var lastWeekMarket = await getClosestTimeStampMarketData(client, now - 604800)
    var lastMonthMarket = await getClosestTimeStampMarketData(client, now - 2629743)
    var lastYearMarket = await getClosestTimeStampMarketData(client, now - 31556926)

    return{
        "today":{
            "active_cryptocurrencies":{
                "flat": currentMarketData.active_cryptocurrencies,
            },
            "active_market":{
                "flat": currentMarketData.active_markets,              
            },
            "bitcoin_marketcap":{
                "flat": currentMarketData.bitcoin_percentage_marketcap,                             
            },
            "total_marketcap":{
                "flat": currentMarketData.total_market_cap,                             
            },
            "total_volume_24h":{
                "flat": currentMarketData.total_volume_24h,                           
            }
        },
        "yesterday" : {
            "timestamp":yesterdayMarket.timestamp,
            "active_cryptocurrencies":{
                "flat": yesterdayMarket.active_cryptocurrencies,
                "diff": currentMarketData.active_cryptocurrencies - yesterdayMarket.active_cryptocurrencies,
            },
            "active_market":{
                "flat": yesterdayMarket.active_markets,
                "diff": currentMarketData.active_markets - yesterdayMarket.active_markets                
            },
            "bitcoin_marketcap":{
                "flat": yesterdayMarket.bitcoin_percentage_marketcap,
                "diff": currentMarketData.bitcoin_percentage_marketcap - yesterdayMarket.bitcoin_percentage_marketcap                             
            },
            "total_marketcap":{
                "flat": yesterdayMarket.total_market_cap,
                "diff": currentMarketData.total_market_cap - yesterdayMarket.total_market_cap                               
            },
            "total_volume_24h":{
                "flat": yesterdayMarket.total_volume_24h,
                "diff": currentMarketData.total_volume_24h - yesterdayMarket.total_volume_24h                              
            }
        },
        "lastWeek" : {
            "timestamp":lastWeekMarket.timestamp,
            "active_cryptocurrencies":{
                "flat": lastWeekMarket.active_cryptocurrencies,
                "diff": currentMarketData.active_cryptocurrencies - lastWeekMarket.active_cryptocurrencies
            },
            "active_market":{
                "flat": lastWeekMarket.active_markets,
                "diff": currentMarketData.active_markets - lastWeekMarket.active_markets                
            },
            "bitcoin_marketcap":{
                "flat": lastWeekMarket.bitcoin_percentage_marketcap,
                "diff": currentMarketData.bitcoin_percentage_marketcap - lastWeekMarket.bitcoin_percentage_marketcap                               
            },
            "total_marketcap":{
                "flat": lastWeekMarket.total_market_cap,
                "diff": currentMarketData.total_market_cap - lastWeekMarket.total_market_cap                               
            },
            "total_volume_24h":{
                "flat": lastWeekMarket.total_volume_24h,
                "diff": currentMarketData.total_volume_24h - lastWeekMarket.total_volume_24h                              
            }
        },
        "lastMonth" : {
            "timestamp":lastMonthMarket.timestamp,
            "active_cryptocurrencies":{
                "flat": lastMonthMarket.active_cryptocurrencies,
                "diff": currentMarketData.active_cryptocurrencies - lastMonthMarket.active_cryptocurrencies
            },
            "active_market":{
                "flat": lastMonthMarket.active_markets,
                "diff": currentMarketData.active_markets - lastMonthMarket.active_markets                
            },
            "bitcoin_marketcap":{
                "flat": lastMonthMarket.bitcoin_percentage_marketcap,
                "diff": currentMarketData.bitcoin_percentage_marketcap - lastMonthMarket.bitcoin_percentage_marketcap                               
            },
            "total_marketcap":{
                "flat": lastMonthMarket.total_market_cap,
                "diff": currentMarketData.total_market_cap - lastMonthMarket.total_market_cap                               
            },
            "total_volume_24h":{
                "flat": lastMonthMarket.total_volume_24h,
                "diff": currentMarketData.total_volume_24h - lastMonthMarket.total_volume_24h                              
            }
        },
        "lastYear" : {
            "timestamp":lastYearMarket.timestamp,
            "active_cryptocurrencies":{
                "flat": lastYearMarket.active_cryptocurrencies,
                "diff": currentMarketData.active_cryptocurrencies - lastYearMarket.active_cryptocurrencies
            },
            "active_market":{
                "flat": lastYearMarket.active_markets,
                "diff": currentMarketData.active_markets - lastYearMarket.active_markets                
            },
            "bitcoin_marketcap":{
                "flat": lastYearMarket.bitcoin_percentage_marketcap,
                "diff": currentMarketData.bitcoin_percentage_marketcap - lastYearMarket.bitcoin_percentage_marketcap                               
            },
            "total_marketcap":{
                "flat": lastYearMarket.total_market_cap,
                "diff": currentMarketData.total_market_cap - lastYearMarket.total_market_cap                               
            },
            "total_volume_24h":{
                "flat": lastYearMarket.total_volume_24h,
                "diff": currentMarketData.total_volume_24h - lastYearMarket.total_volume_24h                              
            }
        }
    }
}

module.exports = {
    get_today_market_data: get_today_market_data,
    read_today_market_data: read_today_market_data,
    get_year_greed_fear_index: get_year_greed_fear_index,
    read_time_period_fng: read_time_period_fng,
    compareFnG: compareFnG,
    compareMarketData: compareMarketData
}