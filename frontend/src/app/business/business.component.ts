import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client';
import {Request} from '../models/request';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { AgencyService } from '../services/agency.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  constructor(private clientService : ClientService, private router : Router, private agencyService : AgencyService) { }

  ngOnInit(): void {
    this.infoMessage = "";
    this.selectedFilter = "";

    this.getLoggedUserFromLocalStorage();

    if(this.loggedUser){
      this.getAllRequests();
    }
    else if(this.loggedAgency){
      this.getAllRequestsForThisAgency();
      this.getAllActiveJobs();
    }
    
    this.offer = 0;
  }



  loggedUser : Client;
  loggedAgency : Agency;                        // Ulogovana agencija
  sortBy : string[] = [
    'zahteve za saradnjom',
    'aktivne poslove',
    'zavrsene poslove'
  ];
  selectedFilter : string;                      // Odabrana vrednost po kojoj filtriramo

  infoMessage : string;

  allRequests : Request[] = [];                 // Svi zahtevi klijenta


  agencyNoRequestsMessage : string;
  agencyNoActiveJobsMessage : string;
  allRequestsAgency : Request[] = [];           // Svi zahtevi agencije
  allActiveJobsAgency : Request[] = [];         // Svi aktivni poslovi agencije (efektivno su ovo i dalje zahtevi, samo se tumace kao poslovi zbog statusa)

  offerArray : number[] = [];                               // Ponuda koju agencija nudi korisniku za izvrsavanje tog posla
  offer : number;


  getLoggedUserFromLocalStorage(){
    let user = localStorage.getItem('user');
    if(user){

      let parsedUser = JSON.parse(user);

      // Check for the user type
      if(parsedUser.type == 'client'){
        this.loggedUser = parsedUser;
        console.log("User je klijent!");
      }
      if(parsedUser.type == 'agency'){
        this.loggedAgency = parsedUser;
        console.log("User je agencija!");
      }
    }
  }


    // -------------- KLIJENT ------------------

  filterBusiness(){
    // Prikazi samo zahteve koji se cekaju - zahtev je ako je requestStatus = awaitingApproval
    if(this.selectedFilter == 'zahteve za saradnjom'){
      this.allRequests = this.allRequests.filter( (request) => request.requestStatus == 'awaitingApproval');
    }

    // Prikazi samo aktivne poslove - aktivan ako je requestStatus = ongoing ili requestStatus = agencyDone
    else if(this.selectedFilter == 'aktivne poslove'){
      this.allRequests = this.allRequests.filter( (request) => request.requestStatus == 'ongoing' || request.requestStatus == 'agencyDone');
    }
    
    // Prikazi samo zavrsene poslove - zavrsen ako je requestStatus = completed
    else if(this.selectedFilter == 'zavrsene poslove'){
      this.allRequests = this.allRequests.filter( (request) => request.requestStatus == 'completed');
    }

  }


  // Dohvatanje zahteva klijenta
  getAllRequests(){
    if(this.loggedUser){
      
      this.clientService.getAllClientRequests(this.loggedUser.username).subscribe( (res : any) => {
        if(res['message'] == 'noRequests'){
          this.infoMessage = "Klijent trenutno nema zahteva ni aktivnih/zavrsenih poslova.";
        }
        else{
          this.allRequests = res;
  
          console.log(this.allRequests);
        }
      });

    }
    
  }


  // Odlazak na stranicu za KLIJENTA na kojoj vidi detaljne podatke o objektu
  goToRequestPage(clickedRequest : Request){

    // Odavde samo taj request gurni u localStorage i uradi redirekciju na tu stranu
    localStorage.setItem('request', JSON.stringify(clickedRequest));
    this.router.navigate(['fullRequestPage']);
  }




  // -------------------- AGENCIJA ---------------------------

  // Dohvatanje zahteva agencije
  getAllRequestsForThisAgency(){
    
    if(this.loggedAgency){
      this.agencyService.getAllRequestsForThisAgency(this.loggedAgency.username).subscribe( (res : any) => {
        if(res['message'] == 'noRequests'){
          this.agencyNoRequestsMessage = "Agencija trenutno nema zahteva!";
          this.allRequestsAgency = null;
        }
        else{
          this.allRequestsAgency = res;
          this.agencyNoRequestsMessage = "";
        }
      });
    }

  }


  // Agencija prihvata zahtev klijenta
  acceptRequest(form : NgForm, req : Request){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    this.offer = this.offerArray[req.requestId];
    console.log("Ovo je offer");
    console.log(this.offer);

    
    // Sacuvaj ponudu agencije u bazi
    this.agencyService.acceptClientRequest(req.requestId, this.offer).subscribe( res => {
      if(res['message'] == 'requestAccepted'){
        alert('Prihvacen zahtev klijenta!');
        this.ngOnInit();
      }
    });
  }


  // Agencija odbija zahtev klijenta
  denyRequest(req : Request){

    this.agencyService.declineClientRequest(req.requestId).subscribe( res => {
      if(res['message'] == 'requestRejected'){
        alert("Odbijen zahtev klijenta!");
        this.ngOnInit();
      }
    });
    
  }


  // Odlazak na stranicu za AGENCIJU na kojoj vidi detaljne podatke o objektu
  goToAgencyRequestPage(clickedRequest : Request){
    localStorage.setItem('request', JSON.stringify(clickedRequest));
    this.router.navigate(['agencyFullRequest']);
  }


  // Dohvatanje aktivnih poslova agencije
  getAllActiveJobs(){
    this.agencyService.getAllActiveJobs(this.loggedAgency.username).subscribe( (res : any) => {
      if(res['message'] == 'noActiveJobs'){
        this.allActiveJobsAgency = null;
        this.agencyNoActiveJobsMessage = "Agencija nema aktivnih poslova!";
      }
      else{
        this.allActiveJobsAgency = res;
        this.agencyNoActiveJobsMessage = "";
      }
    });
  }
  
  

  /*
  getAllAgencies(){
    this.clientService.getAllAgencies().subscribe( (allAgencies : Agency[]) => {

      let i : number;
      let j : number;

      for(i = 0; i < this.allRequests.length; i++){
        for(j = 0; j < allAgencies.length; j++){
          if(this.allRequests[i].agencyUsername == allAgencies[j].username){
            // dodaj u neku listu i sl.
          }
        }
      }

    });
  }
  */

}



