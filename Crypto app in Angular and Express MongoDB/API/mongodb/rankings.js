const fs = require("fs")
const { getAllUsers, addUserBadges } = require("./users_func")

function rankingUserByCurrency(users) {

    var usersRanking = []
    var currentRank = 1

    users.sort((a, b) => {return b["game_party"]["coins"] - a["game_party"]["coins"]})

    for (let i = 0; i < users.length; i++) {
        usersRanking.push({
            "rank": currentRank,
            "username": users[i]["username"],
            "_id": users[i]["_id"],
            "currency": users[i]["game_party"]["coins"]
        })
        currentRank++
    }
    fs.writeFileSync("./data/rankingByCoin.json", JSON.stringify(usersRanking), function () { return })
}

function rankingUserByCoin(users) {

    var usersRanking = []

    var rawData = fs.readFileSync("./data/basicData.json");
    var data = JSON.parse(rawData);

    for (let i = 0; i < users.length; i++) {
        var estimated_total = 0
        for (let j = 0; j < users[i]["game_party"]["coins_in_stock"].length; j++) {
            for (let k = 0; k < data.length; k++) {
                if (users[i]["game_party"]["coins_in_stock"][j]["uuid"] == data[k]["uuid"]) {
                    estimated_total += users[i]["game_party"]["coins_in_stock"][j]["amount"] * data[k]["price"]
                }
            }
        }
        estimated_total += users[i]["game_party"]["coins"]
        usersRanking.push({
            "username": users[i]["username"],
            "_id": users[i]["_id"],
            "estimated_total": estimated_total
        })
    }

    usersRanking.sort((a, b) => {return b["estimated_total"] - a["estimated_total"]})

    for (let i = 0; i < usersRanking.length; i++) {
        usersRanking[i]["rank"] = i + 1
    }

    fs.writeFileSync("./data/rankingByEstimatedTotal.json", JSON.stringify(usersRanking), function () { return })
}

async function resetAllUserGameParty(client) {
    var new_data = {
        "coins": 100000,
        "coins_in_stock": []
    }
    await client.db("CryptoDB").collection("Users").updateMany({}, { $set: { game_party: new_data } });
}

async function giveGamePartyReward(client) {

    var users = await getAllUsers(client)

    rankingUserByCoin(users)
    rankingUserByCurrency(users)

    var rawData = fs.readFileSync("./data/rankingByCoin.json");
    var byCoin = JSON.parse(rawData).slice(0,5)

    var rawData = fs.readFileSync("./data/rankingByEstimatedTotal.json");
    var byEstimatedTotal = JSON.parse(rawData).slice(0,5)

    var places = ["1st", "2nd", "3rd", "4th", "5th"]

    var year = new Date().getFullYear()
    var month  = new Date().getMonth()
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    for(let i = 0; i < byCoin.length; i++){
        let badge_name = places[i]+" in fiat leaderboard for " + months[month] + " " + year
        addUserBadges(client, byCoin[i]['_id'], badge_name)
    }

    for(let i = 0; i < byEstimatedTotal.length; i++){
        let badge_name = places[i]+" in estimated total leaderboard for " + months[month] + " " + year
        addUserBadges(client, byEstimatedTotal[i]['_id'], badge_name)
    }
}

async function getRankings(){
    var rawData = fs.readFileSync("./data/rankingByCoin.json");
    var byCoin = JSON.parse(rawData)

    var rawData = fs.readFileSync("./data/rankingByEstimatedTotal.json");
    var byEstimatedTotal = JSON.parse(rawData)

    return {
        "byCoin" : byCoin,
        "byEstimatedTotal":byEstimatedTotal
    }
}

async function updateUsersAndData(client){
    var users = await getAllUsers(client)
    rankingUserByCoin(users)
    rankingUserByCurrency(users)
}

module.exports = {
    giveGamePartyReward:giveGamePartyReward,
    resetAllUserGameParty:resetAllUserGameParty,
    getRankings:getRankings,
    updateUsersAndData:updateUsersAndData
}