import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }


  // Current



  // Fields to get information from the form

  username : string;
  password : string;
  confirmPassword : string;
  phoneNumber : string;
  email : string;
  userType : string;

  // Information for the client
  firstname : string;
  lastname : string;

  // Information for the agency
  agencyName : string;
  agencyId : string;
  description : string;
  agencyAddress : string;
  streetNumber : string;
  city : string;
  state : string;


  // Fields for additional info on the page
  message : string;


  image;
  selectedImage(event){
    if(event.target.files.length > 0){
      this.image = event.target.files[0];
    }
  }



  register(form :NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    // Validation passed, continue

    const formData = new FormData();
    //formData.append('image', this.image);
    formData.set('firstname', this.firstname);
    formData.set('lastname', this.lastname);
    formData.set('username', this.username);
    formData.set('password', this.password);
    formData.set('phone', this.phoneNumber);
    formData.set('email', this.email);
    
    formData.append('image', this.image);

    console.log(formData);
    
    // Log, to check if values are correctly stored
    for (const value of formData.values()) {
      console.log(value);
    }

    // const urlEncoded = new URLSearchParams(formData as any).toString();


    if(this.userType == 'client'){
      this.userService.registerClient(formData).subscribe( //formData
        (resp) => {

          if(resp['message'] == 'usernameNotUnique'){
            this.message = 'Korisnicko ime vec postoji u sistemu!';
          }

          else if(resp['message'] == 'emailNotUnique'){
            this.message = 'Email adresa vec postoji u sistemu!';
          }

          else if(resp['message'] == 'registeredClient'){
            this.message = 'Klijent uspesno registrovan!';
          }

          else{
            this.message = 'Greska pri registraciji!';
          }
        }
      );
    }
    
    else if(this.userType == 'agency'){
      this.userService.registerAgency(this.agencyName, this.agencyAddress, this.streetNumber, this.city, this.state, this.agencyId, this.description,
        this.username, this.password, this.phoneNumber, this.email).subscribe( (resp) => {

          if(resp['message'] == 'usernameNotUnique'){
            this.message = 'Korisnicko ime vec postoji u sistemu!';
          }

          else if(resp['message'] == 'emailNotUnique'){
            this.message = 'Email adresa vec postoji u sistemu!';
          }

          else if(resp['message'] == 'registeredAgency'){
            this.message = 'Agencija uspesno registrovana!';
          }
          
          else{
            this.message = 'Greska pri registraciji!';
          }
        }
      );
    }
  }



}