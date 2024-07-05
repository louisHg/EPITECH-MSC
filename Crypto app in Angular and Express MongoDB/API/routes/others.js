var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

const { analysisFnG, notifcationCalculations } = require("../calculs")
const { compareMarketData, get_today_market_data } = require("../mongodb/fear_greed_index")
var router = express.Router();

const uri = "mongodb+srv://cryptoStonks2022:roadToFullCredits@cryptodb.ihuff.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function sendFearAndGreed(client) {
    router.get("/FnG", async function (req, res) {
        try {
            await client.connect();
            await get_today_market_data(client);
            var response = await analysisFnG(client)
        }
        catch (e) {
            var response = "Erreur inconnue"
            console.log(e)
        }
        finally {
            await client.close();
        }
        res.send(response)
    })
}

async function sendMarketData(client) {
    router.get("/marketData", async function (req, res) {
        try {
            await client.connect();
            await get_today_market_data(client);
            var response = await compareMarketData(client)
        }
        catch (e) {
            var response = "Erreur inconnue"
            console.log(e)
        }
        finally {
            await client.close();
        }
        res.send(response)
    })
}

async function sendNotifications() {
    router.get("/notifications", async function (req, res) {
        var response = await notifcationCalculations()
        res.send(response)
    })
}

sendFearAndGreed(client)
sendMarketData(client)
sendNotifications()
setInterval(() => sendNotifications(), 300000);

module.exports = router;