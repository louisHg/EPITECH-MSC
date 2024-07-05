import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UserService } from '../../services/Axios.service';

@Component({
  selector: 'general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  providers: [UserService]
})
export class GeneralComponent implements OnInit {
  selectedItem: any;
  json: any;
  avPrice: any = 0;
  name: any;
  rank: any;
  argent: any;
  title = 'CustomTable';
  displayedColumns: string[] = ['rang', 'symbole', 'prix','différence de prix (h24)','en %','market cap','favoris','+'];

  constructor(private dataService: DataService, private axiosService: UserService) {
    this.json = this.axiosService.getAllCoin();
    this.selectedItem = "";
    
    //  this.avPrice = this.json.
  }

  ngOnInit(): void {
    var token = localStorage.getItem("token")// correspond au token de connexion
    console.log(token);
  }
  imprimer() {
    window.print();
  }

  addFavoris(cryptoId: any) {
    console.log(cryptoId);
    
    var token = localStorage.getItem("token")// correspond au token de connexion
    console.log(token);
    this.axiosService.addFavorites(token, cryptoId).subscribe((x: any) => {
    })
    // this.axiosService.UserData(token).subscribe((x: any) => {
    //   localStorage.setItem("user_data",JSON.stringify(x));
    // })
  }
}
