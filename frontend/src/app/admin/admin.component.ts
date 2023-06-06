import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Client } from '../models/client';
import { AdminService } from '../services/admin.service';
import { IdTracking } from '../models/idTracking';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService : AdminService, private router : Router) { }

  ngOnInit(): void {
    
    this.getAllClients();
    this.getAllAgencies();
    this.getPendingClients();
    this.getPendingAgencies();

  }


  allPendingClients : Client[];
  allPendingAgencies : Agency[];
  allClients : Client[];
  allAgencies : Agency[];


  // --------- Za dodavanje novog radnika ------------

  workerId : number;
  workerFirstname : string;
  workerLastname : string;
  workerEmail : string;
  workerPhone : string;
  workerExpertise : string;



  insertNewWorker(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    //alert("Prosla prijava");
    //return; // Dok ne istestiram validatore

    // Dohvatamo poslednji dodeljeni WorkerID, kako bismo novom radniku dodelili za 1 veci
    this.adminService.getLastWorkerId().subscribe( (res : IdTracking) => {
      let lastWorkerId = res.workerId;

      this.workerId = ++lastWorkerId;

      // Formiramo novi Worker objekat koji cemo dodati u bazu
      const worker = {
        workerId : this.workerId,
        firstname : this.workerFirstname,
        lastname : this.workerLastname,
        email : this.workerEmail,
        phoneNumber : this.workerPhone,
        expertise : this.workerExpertise
      }


      // Dodamo novog workera u bazu
      this.adminService.insertNewWorker(worker).subscribe( res => {
        if(res['message'] == 'error'){
          console.log("Greska pri dodavanju radnika u bazu podataka!");
        }
        else if(res['message'] == 'insertedWorker'){
          console.log("Radnik uspesno dodat u bazu podataka!");


          // U bazu unosimo workerId koji smo upravo dodelili poslednjem radniku
          this.adminService.insertNewWorkerId(this.workerId).subscribe( res => {
            if(res['message'] == 'updatedWorkerId'){
              console.log("Uspesno azuriran workerId u bazi!");

              alert("Uspesno dodat radnik!");

              form.resetForm();
              this.router.navigate(['/admin']);
            }
            else{
              console.log("Greska pri azuriranju workerId u bazi!");
            }
          });
        }
      });
    });
  }

  // -------------------------------------------------




  getAllClients(){
    this.adminService.getAllClients().subscribe( (clientList : Client[]) => {
      this.allClients = clientList;
    });
  }


  getAllAgencies(){
    this.adminService.getAllAgencies().subscribe( (agenciesList : Agency[]) => {
      this.allAgencies = agenciesList;
    });
  }


  getPendingClients(){
    this.adminService.getPendingClients().subscribe( (pendingClientsList : Client[]) => {
      this.allPendingClients = pendingClientsList;
    } );
  }


  getPendingAgencies(){
    this.adminService.getPendingAgencies().subscribe( (pendingAgenciesList : Agency[]) => {
      this.allPendingAgencies = pendingAgenciesList;
    } );
  }


  acceptClientRegRequest(pendingClient){

    // Set regStatus to accepted for that client
    this.adminService.acceptClientRegRequest(pendingClient.username).subscribe( res => {
      if(res['message'] == 'clientAccepted'){
        console.log("Klijent uspesno registrovan!");

        this.ngOnInit();      // Reinitialize the component so that updated data is fetched from the database
      }
    });
  }

  declineClientRegRequest(pendingClient){

    // Set regStatus to declined for that client
    this.adminService.declineClientRegRequest(pendingClient.username).subscribe( res => {
      if(res['message'] == 'clientDeclined'){
        console.log("Klijent uspesno odbijen!");

        this.ngOnInit();      // Reinitialize the component so that updated data is fetched from the database
      }
    });
  }

  acceptAgencyRegRequest(pendingAgency){
    
    // Set regStatus to accepted for that agency
    this.adminService.acceptAgencyRegRequest(pendingAgency.username).subscribe( res => {
      if(res['message'] == 'agencyAccepted'){
        console.log("Agencija uspesno registrovana!");

        this.ngOnInit();    // Reinitialize the component so that updated data is fetched from the database
      }
    });
  }

  declineAgencyRegRequest(pendingAgency){
    
    // Set regStatus to declined for that agency
    this.adminService.declineAgencyRegRequest(pendingAgency.username).subscribe( res => {
      if(res['message'] == 'agencyDeclined'){
        console.log("Agencija je uspesno odbijena!");

        this.ngOnInit();    // Reinitialize the component so that updated data is fetched from the database
      }
    });
  }

  // ---------------------------------------------


  // Interakcija admina i klijenata

  // Po kliku na klijenta, admin se vodi na stranicu tog klijenta
  redirectToClientDetailsPage(client : Client){
    localStorage.setItem('clientUsernameForAdmin', client.username);
    this.router.navigate(['adminViewsClientDetails']);
  }


  redirectToAgencyDetailsPage(agency : Agency){
    localStorage.setItem('agencyUsernameForAdmin', agency.username);
    this.router.navigate(['adminViewsAgencyDetails']);
  }
}
