import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  urlinscription: string = "http://localhost:7000/users/register"
  urlConnexion: string = "http://localhost:7000/users/login"
  urlAddFavorites: string = "http://localhost:7000/users/addFavorites"
  urlGetFavorites: string = "http://localhost:7000/users/getFavorites"
  urlDelFavoris: string = "http://localhost:7000/users/removeFavorites"
  urlGetAllCoin:string = "http://localhost:7000/coins/allCoins"
  getUserData: string = "http://localhost:7000/users/getUserData"
  urlGetTransactions: string = "http://localhost:7000/users/getTransactions"

  constructor(private _httpClient: HttpClient) {
  }

  inscriptionUtilisateur(user: any, pass: any, tel: any, email: any) {
    var data = {
      username: user,
      password: pass,
      email: email,
      telephone: tel
    }
    return this._httpClient.post(this.urlinscription, data)
  }

  connexionUtilisateur(user: any, pass: any) {
    var data = {
      username: user,
      password: pass
    }
    return this._httpClient.post(this.urlConnexion, data)
  }


  addFavorites(token: any, cryptoId: any) {

    var data = {
      token: token,
      uuid: cryptoId
    }

    return this._httpClient.post(this.urlAddFavorites, data)
  }

  getFavorites(token: any) {

    var data = { token: token }
    return this._httpClient.post(this.urlGetFavorites, data)

  }

  getTransactions(token: any) {

    var data = { token: token }
    return this._httpClient.post(this.urlGetTransactions, data)
    
  }

  UserData(token: any) {

    var data = { token: token }
    return this._httpClient.post("http://localhost:7000/users/getUserData", data)
    
  }

  delFavoris(token: any, cryptoId: any) {
    var data = {
      token: token,
      uuid: cryptoId
    }
    console.log("delete");
    
    return this._httpClient.post(this.urlDelFavoris, data)
  }

  getAllCoin(){
    return this._httpClient.get(this.urlGetAllCoin)
  }
  getCoin(uuid:any){
    
    return this._httpClient.get("http://localhost:7000/coins/singleCoin?uuid="+uuid)
  }
}