var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

const { allCoins, fullSingleCoinData } = require("../calculs")
const { updateCoinData } = require("../mongodb/coins")
var router = express.Router();

const uri = "mongodb+srv://cryptoStonks2022:roadToFullCredits@cryptodb.ihuff.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function sendSingleCoin(client) {
    router.get("/singleCoin", async function (req, res) {

        let uuid = req.query.uuid
        try {
            await client.connect();
            await updateCoinData(client, uuid, "24h")
            var response = await fullSingleCoinData(client, uuid)
        }
        catch (e) {
            var response = "Erreur inconnue"
            console.log(e)
        }
        finally {
            await client.close();
        }
        res.send(response);
    })
}

async function sendAllCoins() {
    router.get("/allCoins", async function (req, res) {
        var response = await allCoins();
        res.send(response);
    })
}

sendAllCoins(client)
sendSingleCoin(client)
setInterval(()=>sendAllCoins(client),300000);

module.exports = router;