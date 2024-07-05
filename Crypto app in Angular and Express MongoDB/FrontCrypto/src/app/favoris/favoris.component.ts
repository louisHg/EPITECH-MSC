import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';

import { UserService } from '../../services/Axios.service';
@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.scss'],
  providers:[UserService]
})
export class FavorisComponent implements OnInit {
  selectedItem: any;
  json: any = {};
  avPrice: any = 0;
  favoris: any
  favoriss:any
  name: any;
  rank: any;
  argent: any;
  title = 'CustomTable';
  displayedColumns: string[] = ['rang', 'symbole', 'prix','différence de prix (h24)','en %','market cap','favoris','+'];

  constructor(private dataService: DataService, private axiosService: UserService) {
    this.selectedItem = ""
    var token = localStorage.getItem("token") // correspond au token de connexion
    console.log(token);
    this.json = this.dataService.paramJson
    this.axiosService.getFavorites(token).subscribe((x:any) => {
      this.favoris = x
      console.log(this.favoris)
    })

    //  this.avPrice = this.json.
  }


  ngOnInit(): any {
    var token = localStorage.getItem("token")// correspond au token de connexion
    // this.axiosService.getFavorites(token).subscribe((x:any) => {
    //    this.favoris = x
    //    console.log(this.favoris)
   // })

  }
  delFavoris(cryptoId: any) {
    
    var token = localStorage.getItem("token") // correspond au token de connexion
    console.log(cryptoId + token);
    this.axiosService.delFavoris(token, cryptoId);
  }
  getFavoris() {
    var token = localStorage.getItem("token") // correspond au token de connexion
    this.axiosService.getFavorites(token).subscribe((x:any)=>{
      this.favoris = x.data
    }) 

    
}
addFavoris(cryptoId: any) {
    
  var token = localStorage.getItem("token")// correspond au token de connexion
  console.log(token);
  this.axiosService.addFavorites(token, cryptoId).subscribe((x: any) => {
  })
}
log(x:any){
  console.log(x);
  
}
}
