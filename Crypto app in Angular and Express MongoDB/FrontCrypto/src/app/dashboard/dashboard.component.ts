import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/Axios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  connected:any;
  token:any;
  userData:any;
  Update:any;
  favoris: any
  transactions:any;

  constructor(private axiosService:UserService) {
    var token = localStorage.getItem("token")
    this.axiosService.getFavorites(token).subscribe((x:any) => {
      this.favoris = x
      console.log(this.favoris)
    })
   }

  

  ngOnInit(): void {
    this.connexion();
    this.userData = localStorage.getItem("user_data")

    if(typeof(this.userData) == "string"){
      this.userData = JSON.parse(this.userData)
    }
  }

  connexion(){
    // this.refresh();
    if (this.token = localStorage.getItem("token")) {
      this.connected = true;
    }
    else
    {
      this.connected = false;
    }
    
  }

  log(x:any){
    console.log('x : ' + x)
  }

}
