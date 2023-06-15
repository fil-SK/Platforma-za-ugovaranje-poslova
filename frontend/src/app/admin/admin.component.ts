import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Client } from '../models/client';
import { AdminService } from '../services/admin.service';
import { IdTracking } from '../models/idTracking';
import { NgForm } from '@angular/forms';
import { Request } from '../models/request';

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

    this.getAllRequests();
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



  // ------------- Rad admina i poslova --------------------

  allRequests : Request[] = [];                                     // Svi zahtevi tj. poslovi dohvaceni iz baze
  allDistinctClientUsernames : String[] = [];                       // Sva jedinstvena korisnicka imena klijenata iz poslova
  allDistinctAgencyUsernames : String[] = [];                       // Sva jedinstvena korisnicka imena agencija iz poslova 
  clientNames  = new Map<String, String>();                         // Parovi (username, ime + prezime)
  agencyNames = new Map<String, String>();                          // Parovi (username, naziv agencije)


  getAllRequests(){
    this.adminService.getAllRequestsFromCollection().subscribe( (res : Request[]) => {
      this.allRequests = res;

      // Za ove zahteve koje si dohvatio izdvoj koja su to jedinstvena korisnicka imena klijenata i agencija
      let i : number;

      for(i = 0; i < res.length; i++){
        if(!this.allDistinctClientUsernames.includes(res[i].clientUsername)){
          this.allDistinctClientUsernames.push(res[i].clientUsername);
        }

        if(!this.allDistinctAgencyUsernames.includes(res[i].agencyUsername)){
          this.allDistinctAgencyUsernames.push(res[i].agencyUsername);
        }
      }

      /* Ispisi da vidis da li ti je ovo dobro pokupljeno
      console.log(res);
      console.log("Sve agencije");
      console.log(this.allDistinctAgencyUsernames);
      console.log("Svi klijenti");
      console.log(this.allDistinctClientUsernames);
      */


      // Sad iz baze dohvati imena za ta korisnicka imena
      this.adminService.getClientFirstAndLastNames(this.allDistinctClientUsernames).subscribe( (clients : String[]) => {
        
        // Posto svi klijenti postoje, tada je niz allDistinctClientUsernames iste velicine kao i vraceni niz clients
        // Dodatno, posto su pronalazeni po istom redu, tada mogu da uparim redom elemente oba niza i na osnovu toga formiram hes mapu
        
        let i : number;
        for(i = 0; i < clients.length; i++){
          this.clientNames.set(this.allDistinctClientUsernames[i], clients[i]);
        }
      });
      
      // I dohvati nazive za te agencije
      this.adminService.getAgencyNames(this.allDistinctAgencyUsernames).subscribe( (agencies : String[]) => {
       
        let j : number;
        for(j = 0; j < agencies.length; j++){
          this.agencyNames.set(this.allDistinctAgencyUsernames[j], agencies[j]);
        }
        
      });

    });
  }


  displayClientName(request : Request){
    return this.clientNames.get(request.clientUsername);
  }


  displayAgencyName(request : Request){
    return this.agencyNames.get(request.agencyUsername);
  }



  displayDate(request : Request){
    let startDate = new Date(request.startDate);
    let endDate = new Date(request.endDate);

    let startDateString = startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear();
    let endDateString = endDate.getDate() + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear();

    return startDateString + " - " + endDateString;

  }

  adminViewsJob(request : Request){

    let clientName = this.displayClientName(request).toString();
    let agencyName = this.displayAgencyName(request).toString();

    localStorage.setItem('adminRequestClientName', clientName);
    localStorage.setItem('adminRequestAgencyName', agencyName);
    localStorage.setItem('adminRequestRequestId', request.requestId.toString());
    localStorage.setItem('adminRequestDate', this.displayDate(request));

    this.router.navigate(['adminViewsJobDetails']);

  }


  /*
    Iteriranje kroz hes mapu

     this.clientNames.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });
  */




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
