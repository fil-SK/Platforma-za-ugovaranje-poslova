import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
  }

  username : string;
  password : string;

  message : string;


  login(){
    this.userService.loginAdmin(this.username, this.password).subscribe( (admin) => {
      
      if(admin['message'] == 'userNotAdmin'){
        this.message = "Korisnik nije administrator!";
        return;
      }

      else if(admin['message'] == 'userNotExists'){
        this.message = "Korisnik ne postoji u bazi podataka!";
        return;
      }

      else if(admin){
        localStorage.setItem('user', JSON.stringify(admin));
        this.router.navigate(['admin']);
      }

      else{
        this.message = "Neuspešno logovanje kao admin!";
      }
      
    });
  }

}
