import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { AdminService } from '../services/admin.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-views-client',
  templateUrl: './admin-views-client.component.html',
  styleUrls: ['./admin-views-client.component.css']
})
export class AdminViewsClientComponent implements OnInit {

  constructor(private router : Router, private clientService : ClientService, private adminService : AdminService) { }

  ngOnInit(): void {
    this.getClientFromDatabase();
  }



  client : Client;
  clientFirstname : string;
  clientLastname : string;
  clientUsername : string;
  clientPassword : string;
  clientEmail : string;
  clientPhone : string;

  getClientFromDatabase(){

    let clientUsername : string = localStorage.getItem('clientUsernameForAdmin');

    this.clientService.getClientWithThisUsername(clientUsername).subscribe( (res : Client) => {
      this.client = res;

      this.populateForm();
    });
  }


  populateForm(){
    this.clientFirstname = this.client.firstname;
    this.clientLastname = this.client.lastname;
    this.clientEmail = this.client.email;
    this.clientPhone = this.client.phoneNumber;
  }


  getClientImage(){
    const backendUri = "http://localhost:4000";

    const pathBackslash = this.client.imagePath;
    const imagePathForwardSlash = pathBackslash.replace(/\\/g, '/');    // Path is saved with backslash but I need to use forward slash, so replace them

    console.log(imagePathForwardSlash);                                 // Logging to check if path is good
   
    return `${backendUri}/${imagePathForwardSlash}`;                    // Return the path to the image for the logged user
  }


  updateClient(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    // Pre azuriranja mora se proveriti da li je email i dalje jedinstven u sistemu
    if(this.client.email == this.clientEmail){

      // Novouneti mejl je isti kao i trenutni - samim tim i dalje je jedinstven jer je isti pa tada sme da se radi azuriranje

      this.adminService.updateClientWithUsername(this.client.username, this.clientFirstname, this.clientLastname, this.clientEmail, this.clientPhone).subscribe( res => {
        if(res['message'] == 'clientUpdated'){
          alert("Klijent uspesno azuriran!");
  
          this.ngOnInit();
        }
        else{
          console.log("Greska pri azuriranju klijenta!");
        }
      });

    }

    else{

      // Unet je drugaciji mejl - neophodno je proveriti da li je taj novi mejl jedinstven

      this.adminService.verifyEmailUnique(this.clientEmail).subscribe( response => {

        if(response['message'] == 'emailNotUnique'){
          alert("Greska! Email nije jedinstven!");
        }

        else if(response['message'] == 'emailUnique'){

          // Jeste jedinstven, moze da se radi azuriranje

          this.adminService.updateClientWithUsername(this.client.username, this.clientFirstname, this.clientLastname, this.clientEmail, this.clientPhone).subscribe( res => {
            if(res['message'] == 'clientUpdated'){
              alert("Klijent uspesno azuriran!");
      
              this.ngOnInit();
            }
            else{
              console.log("Greska pri azuriranju klijenta!");
            }
          });

        }

      });


    }



    

  }


  deleteClient(){

    this.adminService.deleteClientWithUsername(this.client.username).subscribe( res => {
      if(res['message'] == 'clientDeleted'){
        alert("Klijent uspesno obrisan!");

        this.router.navigate(['admin']);
      }
      else{
        console.log("Greska prilikom brisanja klijenta!");
      }
    });
  }


  returnToAdminPage(){

    localStorage.removeItem('clientUsernameForAdmin');
    this.router.navigate(['admin']);
  }
}
