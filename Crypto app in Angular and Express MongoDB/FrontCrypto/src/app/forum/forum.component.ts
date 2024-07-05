import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  connected:any;
  token:any;
  userData:any;
  Update:any;

  constructor() { }

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

}
