import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
  }


  username : string;
  password : string;

  message : string;


  login(){

    // Try to login as a client
    this.userService.loginClient(this.username, this.password).subscribe( (databaseUserClient) => {
    

      if(databaseUserClient['message'] == 'userIsAdmin'){
        this.message = "Admin se ne moze ulogovati preko ove forme!";
        return;
      }

      else if(databaseUserClient['message'] == 'userIsntClient'){

        // It's not client, check if it is agency
        this.userService.loginAgency(this.username, this.password).subscribe( (databaseUserAgency) => {

          if(databaseUserAgency){
            // Returned agency from database - navigate to agency page
            this.router.navigate(['agency']);
          }
          else{
            // It's not admin, client or agency - user doesn't exist in database
            this.message = "Trazeni korisnik ne postoji u bazi!";
          }
        });
      }

      else{
        // Returned client from database - navigate to client page
        this.router.navigate(['client']);
      }

    });

  }

}
