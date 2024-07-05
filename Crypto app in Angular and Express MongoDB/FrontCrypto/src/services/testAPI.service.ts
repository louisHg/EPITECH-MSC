import { Token } from "@angular/compiler";
import { Injectable } from "@angular/core";
import axios from "axios";
@Injectable({
    providedIn: "root"
})
export class testAPIService {
    // var
    user: string = "_test";
    password: string = "_testtest";
    telephone: string = "012345678";
    mail: string = "test@test.test"

    cryptoId: number = 2;
    cryptoName: string = "test"

    transactionName: string = "crypto1"
    transactionQuantity: number = 2
    transactionPrice: number = 10
    transactionVente: number = 2
    transactionAchat: number = 2

    articleName: string = "test"
    articleContent: number = 1
    articleLink: number = 1
    articleId: string = "test1b2d83a8f95f0add63f4ae6b55181eb0"
    //Routes 
    //Coins
    urlGetSingleCoin:string = "http://localhost:7000/coins/singleCoin?uuid=Qwsogvtv82FCd"
    urlGetAllCoins:string = "http://localhost:7000/coins/allCoins"
    //Market
    urlGetFearAndGreed:string = "http://localhost:7000/FnG"
    urlGetMarketData:string = "http://localhost:7000/marketData"
    urlGetNotification:string = "http://localhost:7000/notifications"
    //Favoris
        urlAddFavoris:string = "http://localhost:7000/users/addFavorites"
        urlUpFavoris:string = "http://localhost:7000/users/updateFavorites"
        urlDelFavoris:string = "http://localhost:7000/users/removeFavorites"
        urlGetFavoris:string = "http://localhost:7000/users/getFavorites"
        //User
        urlInscription: string = "http://localhost:7000/users/register"
        urlConnexion: string = "http://localhost:7000/users/login"
    //transaction
    urlGetTransaction:string = "http://localhost:7000/users/getTransactions"
    urlUpTransaction:string = "http://localhost:7000/users/updateTransactions"
    //badges
    urlGetBadge:string = "http://localhost:7000/users/getBadges"
    urlAddBadge:string = "http://localhost:7000/users/addBadges"
    //Game TRansaction
    urlGetUserData:string = "http://localhost:7000/users/userCoinsData"
    urlGetUserArticle:string = "http://localhost:7000/users/getUserArticles"
    urlUpUserRole:string = "http://localhost:7000/users/updateUserRole"
    urlGetAllUser:string = "http://localhost:7000/users/getAllUsers"
    urlGetUserInfo:string = "http://localhost:7000/users/getUserData"
    //game
    urlGetLeaderboard:string = "http://localhost:7000/ranking/getRankings"
        constructor() {

    }
    testAPI() {
        console.log("/!\\ Test APi /!\\");

        this.inscription()
        this.connexion()

        console.log("/!\\ Test APi CryptoInfo /!\\");
    }
    //Partie Authentification User
    //#region

    inscription() {
        axios.post(this.urlInscription, {
            username: this.user,
            password: this.password,
            email: this.mail,
            telephone: this.telephone
        })
            .then(function (response) {
                console.log("La Route inscription est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route Inscription");

            });
    }
    connexion() {

        axios.post(this.urlConnexion, {
            username: this.user,
            password: this.password
        })
            .then((response) => {
                console.log("La Route Login est fonctionnelle");
                var token = response.data.data
                console.log(token);
                
            this.GetSingleCoin()
            this.GetAllCoins()
            this.GetFearAndGreed()
            this.GetMarketData()
            this.GetNotification()
            // this.AddFavoris(token)
            // this.UpFavoris(token)
            // this.DelFavoris(token)
            // this.GetFavoris(token)
            // this.GetTransactions(token)
            // this.UpTransactions(token)
            // this.GetBadge(token)
            // this.AddBadge(token)
            // this.GetUserData(token)
            this.GetAllUser()
            // this.UpUserRole(token)
            // this.GetUserInfo(token)
            this.GetLeaderboard()

            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route Login");
            });
    }
    GetSingleCoin() {
        axios.get(this.urlGetSingleCoin, {
        })
            .then(function (response) {
                console.log("La Route GetSingleCoin est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetSingleCoin");
            });
    }
    GetAllCoins() {
        axios.get(this.urlGetAllCoins, {
        })
            .then(function (response) {
                console.log("La Route GetAllCoins est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetAllCoins");
            });
    }
    GetFearAndGreed() {
        axios.get(this.urlGetFearAndGreed, {
        })
            .then(function (response) {
                console.log("La Route GetFearAndGreed est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetFearAndGreed");
            });
    }
    GetMarketData() {
        axios.get(this.urlGetMarketData, {
        })
            .then(function (response) {
                console.log("La Route GetMarketData est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetMarketData");
            });
    }
    GetNotification() {
        axios.get(this.urlGetNotification, {
        })
            .then(function (response) {
                console.log("La Route GetNotification est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetNotification");
            });
    }

    AddFavoris(token: any) {
        axios.post(this.urlAddFavoris, {
            token: token,
            uuid:"aKzUVe4Hh_CON"

        })
            .then(function (response) {
                console.log("La Route AddFavoris est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route AddFavoris");
            });
    }
    UpFavoris(token: any) {
        axios.post(this.urlUpFavoris, {
            token: token,
            favorites:["Qwsogvtv82FCd","razxDUgYGNAdQ"]
        })
            .then(function (response) {
                console.log("La Route UpFavoris est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route UpFavoris");
            });
    }
    DelFavoris(token: any) {
        axios.post(this.urlDelFavoris, {
            token: token,
            uuid:"aKzUVe4Hh_CON"
        })
            .then(function (response) {
                console.log("La Route DelFavoris est fonctionnelle");
            })
            .catch(function (error) {
                console.log("Problème sur la route DelFavoris");
            });
    }
    
    GetFavoris(token: any) {
        axios.post(this.urlGetFavoris, {
            token: token
        })
            .then(function (response) {
                console.log("La Route GetFavoris est fonctionnelle");
            })
            .catch(function (error) {
                console.log("Problème sur la route GetFavoris");
            });
    }

    GetTransactions(token: any) {
        axios.post(this.urlGetTransaction, {
            token: token
        })
            .then(function (response) {
                console.log("La Route GetTransactions est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetTransaction");
            });
    }
    UpTransactions(token: any) {
        axios.post(this.urlUpTransaction, {
            token: token,
            transactions:{
                "Qwsogvtv82FCd":[
                    {
                        "amount":1,
                        "type":"achat",
                        "price":10000,
                        "timestamp":1654946280
                    },
                    {
                        "amount":1,
                        "type":"achat",
                        "price":10000,
                        "timestamp":1652267880
                    }
                ],
                "razxDUgYGNAdQ":[
                    {
                        "amount":1,
                        "type":"achat",
                        "price":1000,
                        "timestamp":1654946280
                    },
                                {
                        "amount":1,
                        "type":"achat",
                        "price":2000,
                        "timestamp":1652267880
                    }
                ]
            }
        })
            .then(function (response) {
                console.log("La Route UpTransactions est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route UpTransaction");
            });
    }

    GetBadge(token: any) {
        axios.post(this.urlGetBadge, {
            token: token,
        })
            .then(function (response) {
                console.log("La Route GetBadge est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetBadge");
            });
    }
    AddBadge(token: any) {
        axios.post(this.urlAddBadge, {
            token: token,
            badge : "prof"
        })
            .then(function (response) {
                console.log("La Route AddBadge est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route AddBadge");
            });
    }
    GetUserData(token: any) {
        axios.post(this.urlGetUserData, {
            token: token
        })
            .then(function (response) {
                console.log("La Route GetUserData est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetUserData");
            });
    }
    GetAllUser() {
        axios.get(this.urlGetAllUser, {
        })
            .then(function (response) {
                console.log("La Route GetAllUser est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetAllUser");
            });
    }
    UpUserRole(token:any) {
        axios.post(this.urlUpUserRole, {
            token: token,
            role : "admin",
            target_id:"62cc2896173647b2ca1e5679"
        })
            .then(function (response) {
                console.log("La Route UpUserRole est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route UpUserRole");
            });
    }
    GetUserInfo(token:any) {
        axios.post(this.urlGetUserInfo, {
            token:token
        })
            .then(function (response) {
                console.log("La Route GetUserInfo est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetUserInfo");
            });
    }
    
    GetLeaderboard() {
        axios.get(this.urlGetLeaderboard, {
            
        })
            .then(function (response) {
                console.log("La Route GetLeaderboard est fonctionnelle");
            })
            .catch(function (error) {
                console.log("/!\\  --> Problème sur la route GetLeaderboard");
            });
    }
}