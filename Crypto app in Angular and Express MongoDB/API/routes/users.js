var express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    readOneUser,
    createUserData,
    addUserFavorite,
    removeUserFavorite,
    readUserFavorites,
    updateUserFavorites,
    readUserTransactions,
    updateUserTransactions,
    updateRole,
    getAllUsers,
    readUserBadges,
    addUserBadges,
    getUserArticles,
    getUsersCoins,
    buyUserCoin,
    sellUserCoin
} = require("../mongodb/users_func")
const { userCoinData } = require("../calculs")

var router = express.Router();

const uri = "mongodb+srv://cryptoStonks2022:roadToFullCredits@cryptodb.ihuff.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
JWT_SECRET = "ç&eu_djpo&]@jakjakeljalijç_ç_-367è-7891820JSAOJSO1JOJOJOuhdbsruniziéuijokkkqjkjazop"

async function sendUserCoinData(client, JWT_SECRET) {
    router.post("/userCoinsData", async function (req, res) {

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)

        await client.connect();
        var response = await userCoinData(client, user.username)
        await client.close()

        res.json(response)
    })
}

async function loginUser(client, JWT_SECRET) {
    router.post("/login", async function (req, res) {

        await client.connect();

        const { username, password } = req.body
        const user = await readOneUser(client, username)

        if (!user) {
            return res.json({ status: 'error', error: 'Invalid username/password' })
        }
        if (await bcrypt.compare(password, user.password)) {
            // the username, password combination is successful

            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                JWT_SECRET
            )
            return res.json({ status: 'ok', data: token, user: user })
        }

        await client.close();
        res.json({ status: 'error', error: 'Invalid username/password' })
    })
};

async function registerUser(client) {
    router.post("/register", async function (req, res) {

        await client.connect();

        const { username, password: plainTextPassword, telephone, email } = req.body
        const type_user = "base";

        if (!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username' })
        }

        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }

        if (plainTextPassword.length < 5) {
            return res.json({
                status: 'error',
                error: 'Password too small. Should be atleast 6 characters'
            })
        }

        const password = await bcrypt.hash(plainTextPassword, 10)

        var user = {
            "username": username,
            "password": password,
            "telephone": telephone,
            "mail": email,
            "badges": [],
            "user_type": type_user,
            "favorites": [],
            "transactions": [],
            "article_shared": [],
            "game_party": {
                "coins": 1000,
                "coins_in_stock": []
            }
        }

        try {
            await createUserData(client, user)
            return res.json("User created")
        }
        catch (error) {
            if (error.code === 11000) {
                // duplicate key
                return res.json({ status: 'error', error: 'Username or mail or telephone already in use' })
            }
            throw error
        }
        finally {
            await client.close();
        }
    })
};

async function getUserData(client, JWT_SECRET) {
    router.post("/getUserData", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)

        const userData = await readOneUser(client, user.username)

        await client.close()
        return res.json(userData)
    })
}

async function addFavorite(client, JWT_SECRET) {
    router.post("/addFavorites", async function (req, res) {
        await client.connect();

        const { token, uuid } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await addUserFavorite(client, _id, uuid)
        await client.close()

        return res.json(uuid + " added to favorites")

    })
}

async function removeFavorites(client, JWT_SECRET) {
    router.post("/removeFavorites", async function (req, res) {
        await client.connect();

        const { token, uuid } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        await removeUserFavorite(client, _id, uuid)
        await client.close()

        return res.json(uuid + " removed from favorites")

    })
}

async function getFavorites(client, JWT_SECRET) {
    router.post("/getFavorites", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await readUserFavorites(client, _id)
        await client.close()

        return res.json(response)

    })
}

async function updateFavorites(client, JWT_SECRET) {
    router.post("/updateFavorites", async function (req, res) {
        await client.connect();

        const { token, favorites } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        await updateUserFavorites(client, _id, favorites)
        await client.close()

        return res.json("Updated Favorites")
    })
}

async function getTransactions(client, JWT_SECRET) {
    router.post("/getTransactions", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await readUserTransactions(client, _id)
        await client.close()

        return res.json(response)

    })
}

async function updateTransactions(client, JWT_SECRET) {
    router.post("/updateTransactions", async function (req, res) {
        await client.connect();

        const { token, transactions } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        await updateUserTransactions(client, _id, transactions)
        await client.close()

        return res.json("Updated Transactions")
    })
}

async function updateUserRole(client, JWT_SECRET) {
    router.post("/updateUserRole", async function (req, res) {
        await client.connect();

        const { token, target_id, role } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const userData = await readOneUser(client, user.username)
        if (userData.user_type == "admin") {
            await updateRole(client, target_id, role)
        }

        await client.close()
        return res.json("Updated role")
    })
}

async function allUsers(client, JWT_SECRET) {
    router.get("/getAllUsers", async function (req, res) {
        await client.connect();

        const userData = await getAllUsers(client)

        return res.json(userData)
    })
}

async function getBadges(client, JWT_SECRET) {
    router.post("/getBadges", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await readUserBadges(client, _id)
        await client.close()

        return res.json(response)

    })
}

async function addBadges(client, JWT_SECRET) {
    router.post("/addBadges", async function (req, res) {
        await client.connect();

        const { token, badge } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        await addUserBadges(client, _id, badge)
        await client.close()

        return res.json("Badge added")

    })
}

async function getArticleFromUser(client, JWT_SECRET) {
    router.post("/getUserArticles", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await getUserArticles(client, _id)
        await client.close()

        return res.json(response)
    })
}

async function getUserOrders(client, JWT_SECRET) {
    router.post("/getUserOrder", async function (req, res) {
        await client.connect();

        const { token } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await getUsersCoins(client, _id)
        await client.close()

        return res.json(response)
    })
}

async function userBuyOrder(client, JWT_SECRET) {
    router.post("/userBuyOrder", async function (req, res) {
        await client.connect();

        const { token, buyOrder } = req.body

        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await buyUserCoin(client, _id, buyOrder)
        await client.close()

        return res.json(response)
    })
}

async function userSellOrder(client, JWT_SECRET) {
    router.post("/userSellOrder", async function (req, res) {
        await client.connect();

        const { token, sellOrder } = req.body
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id

        const response = await sellUserCoin(client, _id, sellOrder)
        await client.close()

        return res.json(response)
    })
}



loginUser(client, JWT_SECRET)
registerUser(client)
getUserData(client, JWT_SECRET)

allUsers(client, JWT_SECRET)

updateUserRole(client, JWT_SECRET)

getArticleFromUser(client, JWT_SECRET)

getFavorites(client, JWT_SECRET)
addFavorite(client, JWT_SECRET)
removeFavorites(client, JWT_SECRET)
updateFavorites(client, JWT_SECRET)

getBadges(client, JWT_SECRET)
addBadges(client, JWT_SECRET)

getTransactions(client, JWT_SECRET)
updateTransactions(client, JWT_SECRET)

getUserOrders(client, JWT_SECRET)
userSellOrder(client, JWT_SECRET)
userBuyOrder(client, JWT_SECRET)

sendUserCoinData(client, JWT_SECRET)
setInterval(() => sendUserCoinData(client, JWT_SECRET), 300000);

module.exports = router;