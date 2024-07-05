const { ObjectId } = require('mongodb');
const fs = require("fs")

async function createUserData(client, userData) {
    const result = await client.db("CryptoDB").collection("Users").insertOne(userData)
    return result.insertedId
}

async function readOneUser(client, username) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ username: username });
    return result
}

async function readUserFavorites(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });

    var allCoinsData = fs.readFileSync("./data/basicData.json");
    var allCoinsData = JSON.parse(allCoinsData);

    var favoritesList = []

    for(let i = 0; i < allCoinsData.length; i ++){
        for(let j = 0; j < result.favorites.length; j++){
            if(allCoinsData[i]["uuid"] == result.favorites[j]){
                favoritesList.push({
                    "uuid":result.favorites[j],
                    "name": allCoinsData[i]["name"]
                })
            }
        }
    }
    return favoritesList
}

async function updateUserFavorites(client, user_id, favorites) {
    const result = await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { favorites: favorites } });
}

async function updateUserRole(client, user_id, role) {
    const result = await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { user_type: role } });
}

async function addUserFavorite(client, user_id, favorite) {
    const new_result = await client.db("CryptoDB").collection("Users").findOneAndUpdate({ _id: ObjectId(user_id) }, { $push: { favorites: favorite } });
    return new_result
}

async function removeUserFavorite(client, user_id, favorite) {
    const new_result = await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $pull: { favorites: favorite } });
    return new_result
}

async function addUserTransaction(client, user_id, transaction) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    var current_transactions = result.transactions
    if (!current_transactions[transaction.uuid]) {
        current_transactions[transaction.uuid] = [{ "timestamp": transaction.timestamp, "amount": transaction.amount, "price": transaction.price }]
    }
    else {
        current_transactions[transaction.uuid].push({ "timestamp": transaction.timestamp, "amount": transaction.amount, "price": transaction.price })
    }
    await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { transactions: current_transactions } });
}

async function removeUserTransaction(client, user_id, transaction) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    var current_transactions = result.transactions
    var to_remove = JSON.stringify({ "timestamp": transaction.timestamp, "amount": transaction.amount, "price": transaction.price })
    var new_transactions = []

    for (let i = 0; i < current_transactions[transaction.uuid].length; i++) {
        let to_test = JSON.stringify(current_transactions[transaction.uuid][i])
        if (to_test != to_remove) {
            new_transactions.push(to_test)
        }
    }
    current_transactions[transaction.uuid] = new_transactions

    await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { transactions: current_transactions } });
}

async function updateUserTransactions(client, user_id, transactions) {
    const result = await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { transactions: transactions } });
}

async function readUserTransactions(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    return result.transactions
}

async function removeUser(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").deleteOne({ _id: ObjectId(user_id) });
}

async function getAllUsers(client) {

    const result = await client.db("CryptoDB").collection("Users").find({}).toArray();
    var users = []
    for (let i = 0; i < result.length; i++) {
        users.push(result[i])
    }

    return users
}

async function readUserBadges(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    return result.badges
}

async function addUserBadges(client, user_id, badge) {
    const result = await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $push: { badges: badge } });
}

async function getUserArticles(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    return result.article_shared
}

async function addUserArticle(client, user_id, article_data) {
    await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $push: { article_shared: article_data } });
}

async function buyUserCoin(client, user_id, buyOrder) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });

    var money_spent = buyOrder["amount"] * buyOrder["price"]

    if (money_in_stock < money_spent) {
        return { "error": "not enough currency for that buy order" }
    }

    var money_in_stock = result["game_party"]["coins"] - money_spent
    var coins_in_stock = result["game_party"]["coins_in_stock"]

    if (coins_in_stock.length == 0) {
        coins_in_stock.push({
            "amount": buyOrder["amount"],
            "uuid": buyOrder["uuid"]
        })
    }
    else {
        for (let i = 0; i < coins_in_stock.length; i++) {
            if (coins_in_stock[i]["uuid"] == buyOrder["uuid"]) {
                coins_in_stock[i]["amount"] += buyOrder["amount"]
            }
            else {
                coins_in_stock.push({
                    "amount": buyOrder["amount"],
                    "uuid": buyOrder["uuid"]
                })
            }
        }
    }

    var new_data = {
        "coins": money_in_stock,
        "coins_in_stock": coins_in_stock
    }

    await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { game_party: new_data } });

    return { "result": "success" }
}

async function sellUserCoin(client, user_id, sellOrder) {

    var money_gained = sellOrder["amount"] * sellOrder["price"]

    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });

    var money_in_stock = result["game_party"]["coins"] + money_gained
    var coins_in_stock = result["game_party"]["coins_in_stock"]

    for (let i = 0; i < coins_in_stock.length; i++) {
        if (coins_in_stock[i]["uuid"] == sellOrder["uuid"]) {
            if (coins_in_stock[i]["amount"] < sellOrder["amount"]) {
                return { "error": "not enough currency to sell" }
            }
            coins_in_stock[i]["amount"] -= sellOrder["amount"]
        }
    }
    var new_data = {
        "coins": money_in_stock,
        "coins_in_stock": coins_in_stock
    }
    await client.db("CryptoDB").collection("Users").updateOne({ _id: ObjectId(user_id) }, { $set: { game_party: new_data } });
    return { "result": "success" }
}

async function getUsersCoins(client, user_id) {
    const result = await client.db("CryptoDB").collection("Users").findOne({ _id: ObjectId(user_id) });
    return result["game_party"]
}

module.exports = {
    createUserData: createUserData,
    readOneUser: readOneUser,
    readUserFavorites: readUserFavorites,
    updateUserFavorites: updateUserFavorites,
    addUserFavorite: addUserFavorite,
    removeUserFavorite: removeUserFavorite,
    addUserTransaction: addUserTransaction,
    removeUserTransaction: removeUserTransaction,
    readUserTransactions: readUserTransactions,
    updateUserTransactions: updateUserTransactions,
    removeUser: removeUser,
    updateRole: updateUserRole,
    getAllUsers: getAllUsers,
    readUserBadges: readUserBadges,
    addUserBadges: addUserBadges,
    getUserArticles: getUserArticles,
    addUserArticle: addUserArticle,
    buyUserCoin: buyUserCoin,
    sellUserCoin: sellUserCoin,
    getUsersCoins: getUsersCoins
}