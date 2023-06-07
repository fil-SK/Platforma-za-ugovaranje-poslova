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
