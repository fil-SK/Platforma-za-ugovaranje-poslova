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
            // Returned agency from database 

            // Check if agency is marked as 'pending' or 'declined' - if it is then deny login
            if(databaseUserAgency['message'] == 'regStatusPending'){
              this.message = "Administrator jos uvek nije odobrio regisraciju ovoj agenciji!";
              return;
            }
            else if(databaseUserAgency['message'] == 'regStatusDeclined'){
              this.message = "Administrator je odbio zahtev za registraciju ove agencije!";
              return;
            }
            else if(databaseUserAgency['message'] == 'userIsntAgency'){
              this.message = "Trazeni korisnik ne postoji u bazi!";
            }
            else{
              // Agency is 'accepted' - navigate to agency page
              localStorage.setItem('user', JSON.stringify(databaseUserAgency));   // Save user in local storage
              this.router.navigate(['agency']);
            }
            
          }
          else{ // If returned null
            // It's not admin, client or agency - user doesn't exist in database
            this.message = "Trazeni korisnik ne postoji u bazi!";
            return;
          }
        });
      }

      else{
        // Returned client from database 

        // Check if client is marked as 'pending' or 'declined' - if it is then deny login
        if(databaseUserClient['message'] == 'regStatusPending'){
          this.message = "Administrator jos uvek nije odobrio registraciju ovom klijentu!";
          return;
        }
        else if(databaseUserClient['message'] == 'regStatusDeclined'){
          this.message = "Administrator je odbio zahtev za registraciju ovog klijenta!";
        }
        else{
          // Client is 'accepted' - navigate to client page
          localStorage.setItem('user', JSON.stringify(databaseUserClient));
          this.router.navigate(['client']);
        }
      }

    });

  }

}
