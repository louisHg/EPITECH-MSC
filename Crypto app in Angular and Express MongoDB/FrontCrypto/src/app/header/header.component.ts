import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any>= new EventEmitter();
  @Output() deconnexionEvent= new EventEmitter();

  token:any;
  connected:any;
  userData:any;

  constructor() { }

  ngOnInit(): void {
    this.connexion();
    this.userData = localStorage.getItem("user_data")

    if(typeof(this.userData) == "string"){
      this.userData = JSON.parse(this.userData)
    }
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
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
  deconnexion(){
    localStorage.removeItem("token");
    location.reload()
  }
  refresh(){
    location.reload();
  }
}
