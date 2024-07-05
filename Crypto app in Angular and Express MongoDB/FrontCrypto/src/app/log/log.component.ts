import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/Axios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: [UserService]
})
export class LogComponent implements OnInit {

  Log: any;
  angForm: FormGroup | any;
  connexionForm: FormGroup | any;


  constructor(private axiosService: UserService, private fb: FormBuilder) {
    this.Log = 0;
    this.createForm();
    this.getLog();
  }

  ngOnInit(): void{
  }


  createForm() {
    this.angForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.connexionForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }


  onClickSubmit(user: any, pass: any, tel: any, email: any) {
    this.axiosService.inscriptionUtilisateur(user, pass, tel, email).subscribe((x:any)=>{
      if(x== "User created"){
        this.Log = 1
      }
    })
  }

  
  ConnexionSubmit(user: any, pass: any) {
    this.axiosService.connexionUtilisateur(user, pass).subscribe((x: any) => {
      if (x.data) {
        localStorage.setItem("token", x.data)
        var token = localStorage.getItem("token")// correspond au token de connexion
        console.log(token);
        localStorage.setItem("user_data",JSON.stringify(x.user));
        location.href = "http://localhost:4200/Accueil"
      }
    })

  }

  /// FO pour savoir si on veut se connecter ou s'inscrire  
  ///
  getLog() {
    var url = window.location.href
    var split = url.split('?');
    var split2 = split[1].split('=');
    url = split2[1];
    /// se connecter = 1 et s'inscrire = 0
    if ((url == '0') || (url == '1')) {
      this.Log = url
    }
    else {
      this.Log = 0
    }
  }
}
