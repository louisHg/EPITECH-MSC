var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { updateUsersAndData, getRankings, giveGamePartyReward, resetAllUserGameParty } = require("../mongodb/rankings")

var router = express.Router();

const uri = "mongodb+srv://cryptoStonks2022:roadToFullCredits@cryptodb.ihuff.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
JWT_SECRET = "ç&eu_djpo&]@jakjakeljalijç_ç_-367è-7891820JSAOJSO1JOJOJOuhdbsruniziéuijokkkqjkjazop"


async function getLeaderBoard(client) {
    router.get("/getRankings", async function (req, res) {
        await client.connect();
        await updateUsersAndData(client)
        var response = await getRankings(client)
        await client.close()
        return res.json(response)
    })
}

async function resetLeaderboard(client, JWT_SECRET) {
    router.post("/resetLeaderboard", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)

        const userData = await readOneUser(client, user.username)
        if (userData.user_type == "admin") {
            await giveGamePartyReward(client)
            await resetAllUserGameParty(client)
        }

        await client.close()
        return res.json("Updated role")
    })
}


getLeaderBoard(client)
resetLeaderboard(client, JWT_SECRET)


module.exports = router;