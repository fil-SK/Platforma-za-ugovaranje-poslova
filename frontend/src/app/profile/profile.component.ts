import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AgencyService } from '../services/agency.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private clientService : ClientService,
              private agencyService : AgencyService,
              private adminService : AdminService,
              private router : Router) { }

  ngOnInit(): void {
    this.getLoggedUser();
    this.fillFormData();
  }


  loggedUser;         // Logged user, saved in localStorage

  firstname : string;
  lastname : string;
  email : string;
  phoneNumber : string;
  agencyName : string;
  streetAddress : string;
  streetNumber : string;
  description : string;


  oldPassword : string;
  newPassword : string;
  againNewPassword : string;



  getLoggedUser(){
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
  }


  fillFormData(){
    this.email = this.loggedUser.email;
    this.phoneNumber = this.loggedUser.phoneNumber;

    if(this.loggedUser.type == "client"){
      this.firstname = this.loggedUser.firstname;
      this.lastname = this.loggedUser.lastname;
    }
    else{ // Fill the rest for the agency
      this.agencyName = this.loggedUser.agencyName;
      this.streetAddress = this.loggedUser.streetAddress;
      this.streetNumber = this.loggedUser.streetNumber;
      this.description = this.loggedUser.description;
    }

    this.oldPassword = "";    // Initially set the default value to empty string, to enable validation
  }


  updateData(){
    // TODO
  }

  changePassword(form : NgForm){
    
    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    // Check if old password from the input matches current password of the logged user
    if(this.oldPassword != this.loggedUser.password){
      return;
    }


    // Check if newPassword matches againNewPassword form input
    if(this.newPassword != this.againNewPassword){
      return;
    }


    // Correct old password, and matched newPassword with againNewPassword - update the password for the user
    if(this.loggedUser.type == 'client'){
      this.clientService.changePassword(this.loggedUser.username, this.newPassword).subscribe( res => {
        if(res['message'] == 'changedPassword'){
          alert('Lozinka je uspesno promenjena!');

          this.router.navigate(['logout']);     // After password is changed, navigate user to the logout component, which will upon init clear localStorage and redirect to homepage
        }
      });
    }
    else if(this.loggedUser.type == 'agency'){
      this.agencyService.changePassword(this.loggedUser.username, this.newPassword).subscribe( res => {
        
        if(res['message'] == 'changedPassword'){
          alert('Lozinka je uspesno promenjena!');
          this.router.navigate(['logout']);
        }
      });
    }
    else{
      // Change admin password
      this.adminService.changePassword(this.loggedUser.username, this.newPassword).subscribe( res => {
        if(res['message'] == 'changedPassword'){
          alert('Lozinka je uspesno promenjena!');
          this.router.navigate(['logout']);
        }
      });
    }

  }
}
