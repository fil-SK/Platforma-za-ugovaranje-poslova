import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { Request } from '../models/request';
import { ClientService } from '../services/client.service';
import { RealEstate } from '../models/realestate';
import { Agency } from '../models/agency';
import { AgencyService } from '../services/agency.service';

import { ViewChild, AfterViewInit } from '@angular/core';
import { Review } from '../models/review';

@Component({
  selector: 'app-full-request-page',
  templateUrl: './full-request-page.component.html',
  styleUrls: ['./full-request-page.component.css']
})
export class FullRequestPageComponent implements OnInit, AfterViewInit {

  @ViewChild("requestSchema", {static : false}) requestCanvasReference;


  constructor(private router : Router, private clientService : ClientService, private agencyService : AgencyService) { }

  ngOnInit(): void {
    this.agency = new Agency();
    this.realEstateUnderRenovation = new RealEstate();

    this.getLoggedUserFromLocalStorage();
    this.getRequestFromLocalStorage();
    this.formatDate();

    this.getRealEstateForRequest();
  }


  ngAfterViewInit(): void {
    
    const canvas : HTMLCanvasElement = this.requestCanvasReference.nativeElement;
    const context = canvas.getContext('2d');

    this.displayRequestSchema(context);
  }




  loggedUser : Client;                                  // Dohvacen klijent iz local storage-a
  selectedRequest : Request;                            // Dohvacen zahtev iz local storage-a
  realEstateUnderRenovation : RealEstate;               // Dohvacen objekat koji se renovira, na osnovu realEstateId iz zahteva
  agency : Agency;                                     // Agencija koja izvrsava zahtev / posao 


  requestStartDate : string;
  requestEndDate : string;



  getLoggedUserFromLocalStorage(){
    let user = localStorage.getItem('user');
    if(user){
      this.loggedUser = JSON.parse(user);
    }
  }


  getRequestFromLocalStorage(){
    let request = localStorage.getItem('request');
    if(request){
      this.selectedRequest = JSON.parse(request);


      // Posto sam dohvatio o kom requestu se radi, bolje mi je da azuriranu vrednost requesta dovucem iz baze
      this.clientService.getRequestWithThisId(this.selectedRequest.requestId).subscribe( (res : Request) => {
        this.selectedRequest = res;

        // Ako je za ovaj zahtev vec postavljena recenzija, onda popuni odgovarajuca polja
        if(this.selectedRequest.review){
          this.reviewRatingFromDB = this.selectedRequest.review.rating;
          this.reviewCommentFromDB = this.selectedRequest.review.comment;
        }
        else{
          this.reviewRating = null;
          this.reviewRatingFromDB = null;
          this.reviewComment = "";
          this.reviewCommentFromDB = "";
        }
      });
    }
  }

  formatDate(){

    // Convert to Date format
    let startDate = new Date(this.selectedRequest.startDate);
    let endDate = new Date(this.selectedRequest.endDate);

    let day = startDate.getDate();
    let month = startDate.getMonth() + 1;
    let year = startDate.getFullYear();

    this.requestStartDate = year + "-" + month + "-" + day;


    day = endDate.getDate();
    month = endDate.getMonth() + 1;
    year = endDate.getFullYear();

    this.requestEndDate = year + "-" + month + "-" + day;
  }


  // Za prikaz skice - koristim identicnu metodu kao i za prikaz skice kod Full Real Estate Details komponente
  displayRequestSchema(context : CanvasRenderingContext2D){


    let doorImagePath = this.realEstateUnderRenovation.doorImagePath;
    let allRooms = this.realEstateUnderRenovation.roomArray;


    let i : number;
    for(i = 0; i < allRooms.length; i++){

      // Get all data from the room
      let xCoord = allRooms[i].roomCoord.x;
      let yCoord = allRooms[i].roomCoord.y;
      let roomWidth = allRooms[i].roomCoord.width;
      let roomHeight = allRooms[i].roomCoord.height;
      let roomColor = allRooms[i].roomColor;

      let doorPosition = allRooms[i].doorPosition;
      let doorXCoord = allRooms[i].doorCoord.x;
      let doorYCoord = allRooms[i].doorCoord.y;
      let doorWidth = allRooms[i].doorCoord.width;
      let doorHeight = allRooms[i].doorCoord.height;


      // Draw room shape and fill the color of the room
      context.fillStyle = roomColor;
      context.strokeRect(xCoord, yCoord, roomWidth, roomHeight);
      context.fillRect(xCoord, yCoord, roomWidth, roomHeight);

      // Draw the doors
      const doorImage = new Image();
      doorImage.src = 'http://localhost:4000/uploads/doorVector.png';

      doorImage.onload = function(){
        
        // TODO! Napisi ona tvoja pravila sto si smislio
        if(doorPosition == 'normal'){
          context.drawImage(doorImage, doorXCoord, doorYCoord, doorWidth, doorHeight);
        }
        
        else{
          context.save();                                 // Save current canvas before rotation
          context.translate(doorXCoord, doorYCoord);      // Translate (0,0) of canvas to the door start

          // Rotate canvas differently, based on the required door position
          if(doorPosition == 'reverse'){
            context.rotate(Math.PI);
            context.drawImage(doorImage, -doorWidth, -2*doorHeight, doorWidth, doorHeight);
          }
          else if(doorPosition == 'toLeft'){
            context.rotate(270 * Math.PI / 180);
            context.drawImage(doorImage, -doorWidth, -doorHeight, doorWidth, doorHeight);
          }
          else if(doorPosition == 'toRight'){ 
            context.rotate(90 * Math.PI / 180);
            context.drawImage(doorImage, 0, -doorHeight, doorWidth, doorHeight);
          }


          context.restore();    // Return canvas to state before rotation - this way we return (0,0) of canvas to its starting point
        }
        
        
      }
      
    }
  }




  getRealEstateForRequest(){

    let realEstateId = this.selectedRequest.realEstateId;

    this.clientService.getRealEstateForThisId(realEstateId).subscribe( (realEstate : RealEstate) => {
      this.realEstateUnderRenovation = realEstate;

      console.log("Dohvacen objekat na osnovu ID-a");
      console.log(this.realEstateUnderRenovation);

      this.ngAfterViewInit();


      this. checkIfAgencyDone();            // Proveri da li je agencija zavrsila sa poslom, ako jeste prikazi dugme za placanje (zapravo ono samo postavlja status na completed)

      // Tek kada si dohvatio objekat, pozovi dohvatanje agencije
      this.getAgencyDoingBusiness();
    });
    
  }


  getAgencyDoingBusiness(){
    let agencyUsername = this.selectedRequest.agencyUsername;

    this.agencyService.getAgencyWithUsername(agencyUsername).subscribe( (res : Agency) => {
      this.agency = res;
    });
  }


  requestStatusAgencyDone : boolean;

  checkIfAgencyDone(){
    if(this.selectedRequest.requestStatus == 'agencyDone'){
      this.requestStatusAgencyDone = true;
    }
    else{
      this.requestStatusAgencyDone = false;
    }
  }


  setRequestStatusToCompleted(){
    this.clientService.markRequestAsCompleted(this.selectedRequest.requestId).subscribe( res => {
      if(res['message'] == 'setAsCompleted'){
        

        // Posto si finalizirao posao, oslobodi radnike koji su radili na tom poslu
        this.agencyService.releaseWorkersFromJob(this.agency.username, this.selectedRequest.allWorkers).subscribe( response => {
          if(response['message'] == 'workersSuccessfullyRestored'){
            alert("Uspesno finalizirao posao!");

            this.ngOnInit();        // Pozovi ponovnu inicijalizaciju komponente da bi se izvrsilo azuriranje i dohvatanje podataka iz baze
          }
        });

      }
      
      else{
        console.log("Greska pri finaliziranju posla");
      }
    });
  }



  returnToBusinessPage(){
    localStorage.removeItem('request');
    this.router.navigate(['business']);
  }
  


  // Klijent prihvata ili odbija ponudu cene agencije za uslugu
  acceptOffer(){
    this.clientService.acceptAgencyOffer(this.selectedRequest.requestId).subscribe( res => {
      if(res['message'] == 'offerAccepted'){
        alert("Ponuda prihvacena!");
        

        // Svakako sam azurirani request sacuvao u bazi, ali posto ovde dohvatam request iz localStorage-a onda moram da ga azuriram i tamo
        this.ngOnInit();
      }
    });
    
  }

  rejectOffer(){
    this.clientService.rejectAgencyOffer(this.selectedRequest.requestId).subscribe( res => {
      if(res['message'] == 'offerRejected'){
        alert("Ponuda odbijena!");
        this.ngOnInit();
      }
    });
    
  }



  reviewRating : number;
  reviewComment : string;
  reviewRatingFromDB : number;        // Ova dva tipa su za prikaz ocene i komentara, u slucaju kada su oni vec postavljeni, pa ako hocemo da ih izmenimo ili obrisemo
  reviewCommentFromDB : string;
  reviewErrorMessage : string;        // Poruka koja se ispisuje kao greska za recenziju

  // Klijent PRVI put ostavlja komentar za ovaj zahtev
  makeReview(){
    
    // Proveri da li su vrednosti unete
    if(!this.reviewRating || !this.reviewComment){
      this.reviewErrorMessage = "Morate uneti sve podatke za recenziju!";
      return;
    }

    // Proveri da li je ocena iz opsega 1-5
    if(this.reviewRating == 1 || this.reviewRating == 2 || this.reviewRating == 3 || this.reviewRating == 4 || this.reviewRating == 5){
      this.reviewErrorMessage = "";
    }
    else{
      this.reviewErrorMessage = "Ocena mora biti ceo broj, iz opsega [1-5]!";
      return;
    }

    this.reviewErrorMessage = "";

    let review : Review = new Review();
    review.rating = this.reviewRating;
    review.comment = this.reviewComment;


    // Sacuvaj recenziju u bazi
    this.clientService.insertReview(this.selectedRequest.requestId, review).subscribe( res => {
      if(res['message'] == 'reviewAdded'){
        alert("Recenzija je uspesno dodata!");

        this.ngOnInit();
      }
    });
  }


  editReview(){
    
    // Proveri da li su vrednosti unete
    if(!this.reviewRatingFromDB || !this.reviewCommentFromDB){
      this.reviewErrorMessage = "Morate uneti sve podatke za izmenu recenzije!";
      return;
    }

    // Proveri da li je ocena iz opsega 1-5
    if(this.reviewRatingFromDB == 1 || this.reviewRatingFromDB == 2 || this.reviewRatingFromDB == 3 || this.reviewRatingFromDB == 4 || this.reviewRatingFromDB == 5){
      this.reviewErrorMessage = "";
    }
    else{
      this.reviewErrorMessage = "Ocena mora biti ceo broj, iz opsega [1-5]!";
      return;
    }

    this.reviewErrorMessage = "";


    // Azuriraj recenziju - koristimo istu metodu kao i za unos recenzije, zato sto je realizovana kroz set
    let reviewUpdated : Review = new Review();
    reviewUpdated.rating = this.reviewRatingFromDB;
    reviewUpdated.comment = this.reviewCommentFromDB;

    this.clientService.insertReview(this.selectedRequest.requestId, reviewUpdated).subscribe( res => {
      if(res['message'] == 'reviewAdded'){
        alert("Recenzija je uspesno izmenjena!");

        this.ngOnInit();
      }
    });
  }


  deleteReview(){
    
    let requestId = this.selectedRequest.requestId;

    this.clientService.deleteReview(requestId).subscribe( res => {
      if(res['message'] == 'reviewDeleted'){
        alert("Recenzija je uspesno obrisana!");

        this.ngOnInit();
      }
    });
  }
}
