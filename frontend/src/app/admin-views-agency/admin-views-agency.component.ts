import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgencyService } from '../services/agency.service';
import { Agency } from '../models/agency';
import { AdminService } from '../services/admin.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-views-agency',
  templateUrl: './admin-views-agency.component.html',
  styleUrls: ['./admin-views-agency.component.css']
})
export class AdminViewsAgencyComponent implements OnInit {

  constructor(private router : Router, private agencyService : AgencyService, private adminService : AdminService) { }

  ngOnInit(): void {
    this.getAgencyFromDatabase();
  }



  agency : Agency;
  agencyName : string;
  agencyStreetName : string;
  agencyStreetNumber : string;
  agencyCity : string;
  agencyState : string;
  agencyDescription : string;
  agencyPhone : string;
  agencyEmail : string;


  

  getAgencyFromDatabase(){

    let agencyUsername : string = localStorage.getItem('agencyUsernameForAdmin');

    this.agencyService.getAgencyWithUsername(agencyUsername).subscribe( (res : Agency) => {
      this.agency = res;

      this.populateForm();
    });
  }


  populateForm(){
    this.agencyName = this.agency.agencyName;
    this.agencyStreetName = this.agency.streetAddress;
    this.agencyStreetNumber = this.agency.streetNumber;
    this.agencyCity = this.agency.city;
    this.agencyState = this.agency.state;
    this.agencyDescription = this.agency.description;
    this.agencyPhone = this.agency.phoneNumber;
    this.agencyEmail = this.agency.email;
  }


  getAgencyImage(){
    const backendUri = "http://localhost:4000";

    const pathBackslash = this.agency.imagePath;
    const imagePathForwardSlash = pathBackslash.replace(/\\/g, '/');    // Path is saved with backslash but I need to use forward slash, so replace them

    console.log(imagePathForwardSlash);                                 // Logging to check if path is good
   
    return `${backendUri}/${imagePathForwardSlash}`;                    // Return the path to the image for the logged user
  }



  updateAgencyInDB(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    const data = {
      username : this.agency.username,
      agencyName : this.agencyName,
      streetAddress : this.agencyStreetName,
      streetNumber : this.agencyStreetNumber,
      city : this.agencyCity,
      state : this.agencyState,
      description : this.agencyDescription,
      phoneNumber : this.agencyPhone,
      email : this.agencyEmail
    };

    this.adminService.updateAgencyWithUsername(data).subscribe( res => {
      if(res['message'] == 'agencyUpdated'){
        alert("Uspesno azurirana agencija!");
        
        this.ngOnInit();
      }
      else{
        console.log("Greska pri azuriranju agencije!")
      }
    });

  }


  deleteAgencyFromDB(){
    this.adminService.deleteAgencyWithUsername(this.agency.username).subscribe( res => {
      if(res['message'] == 'agencyDeleted'){
        alert("Agencija uspesno obrisana!");

        this.router.navigate(['admin']);
      }
      else{
        console.log("Greska pri brisanju agencije iz baze!");
      }
      
    });
  }


  returnToAdminPage(){

    localStorage.removeItem('agencyUsernameForAdmin');
    this.router.navigate(['admin']);
  }
}
