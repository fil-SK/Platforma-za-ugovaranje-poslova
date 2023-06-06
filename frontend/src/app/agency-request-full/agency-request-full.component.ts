import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Request } from '../models/request';
import { RealEstate } from '../models/realestate';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client';

import { ViewChild, AfterViewInit } from '@angular/core';
import { Room } from '../models/room';
import { AgencyService } from '../services/agency.service';

@Component({
  selector: 'app-agency-request-full',
  templateUrl: './agency-request-full.component.html',
  styleUrls: ['./agency-request-full.component.css']
})
export class AgencyRequestFullComponent implements OnInit, AfterViewInit {

  @ViewChild("requestSchemaAgency", {static : false}) agencyRequestCanvasRef


  constructor(private router : Router, private clientService : ClientService, private agencyService : AgencyService) { }

  ngOnInit(): void {
    this.client = new Client();
    this.realEstateUnderRenovation = new RealEstate();

    this.getLoggedAgencyFromLocalStorage();
    this.getRequestFromLocalStorage();
    this.formatDate();

    this.getRealEstateForRequest();
  }

  ngAfterViewInit(): void {
    
    const canvas : HTMLCanvasElement = this.agencyRequestCanvasRef.nativeElement;
    const context = canvas.getContext('2d');

    this.displayRequestSchema(context);
  }




  loggedAgency : Agency;
  selectedRequest : Request;                          // Zahtev na koji je agencija kliknula za detaljniji prikaz
  realEstateUnderRenovation : RealEstate;             // Dohvacen objekat koji se renovira, na osnovu realEstateId iz zahteva

  client : Client;                                    // Klijent sa kojim radi ova agencija

  // Za prikaz datuma
  requestStartDate : string;
  requestEndDate : string;



  getLoggedAgencyFromLocalStorage(){
    let user = localStorage.getItem('user');
    if(user){
      this.loggedAgency = JSON.parse(user);
    }
  }


  getRequestFromLocalStorage(){
    let request = localStorage.getItem('request');
    if(request){
      this.selectedRequest = JSON.parse(request);
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



   // Za prikaz skice - identicna metoda kao i u FullRequestPage komponenti, tj. u komponenti gde klijent vidi detalje zahteva
   displayRequestSchema(context : CanvasRenderingContext2D){


    let doorImagePath = this.realEstateUnderRenovation.doorImagePath;
    let allRooms = this.realEstateUnderRenovation.roomArray;
    console.log("Usao u metodu za crtanje");
    

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






  // Dohvatamo objekat za koji se izvrsava zahtev
  // Za ovo sam iskoristio Client Service, jer tamo svakako vec imam metodu koja mi dohvata bas ovo sto mi treba
  getRealEstateForRequest(){

    let realEstateId = this.selectedRequest.realEstateId;

    this.clientService.getRealEstateForThisId(realEstateId).subscribe( (realEstate : RealEstate) => {
      this.realEstateUnderRenovation = realEstate;

      console.log("Dohvacen objekat na osnovu ID-a");
      console.log(this.realEstateUnderRenovation);

      this.ngAfterViewInit();       // Pozivam ovde da se iscrta zato sto po njegovom inicijalnom crtanju nije hteo lepo da povuce podatke jer su metode asinhrone u ngOnInit


      this.allRoomsFinished();      // Proveravamo da li su sve sobe zavrsene, kako bismo mogli da postavimo status zahteva na agencyDone

      // Tek kada si dohvatio objekat, pozovi dohvatanje klijenta s kojim radis
      this.getClientDoingBusiness();
    });
    
  }


  // Dohvatamo podatke o klijentu s kojim poslujemo u ovom zahtevu
  getClientDoingBusiness(){

    let clientUsername = this.selectedRequest.clientUsername;

    this.clientService.getClientWithThisUsername(clientUsername).subscribe( (res : Client) => {
      this.client = res;

      console.log("Dohvacen klijent:");
      console.log(res);
    });
  }



  renovateTheRoom(room : Room){
    
    let roomId = room.roomId;
    let roomColor : string = "red";

    this.agencyService.changeRoomColor(roomId, roomColor).subscribe( res => {
      if(res['message'] == 'roomUpdated'){
        console.log("Uspesno promenjena boja sobe!");
        alert('Zapoceto renoviranje sobe!');

        this.ngOnInit();
        //this.router.navigate(['agencyFullRequest']);
      }
      else{
        console.log("Greska u promeni boje sobe!");
      }
    });

  }

  finishRenovatingTheRoom(room : Room){
    
    let roomId = room.roomId;
    let roomColor : string = "green";

    this.agencyService.changeRoomColor(roomId, roomColor).subscribe( res => {
      if(res['message'] == 'roomUpdated'){
        console.log("Uspesno promenjena boja sobe!");
        alert('Uspesno zavrseni radovi na sobi!');

        this.ngOnInit();
        //this.router.navigate(['agencyFullRequest']);
      }
      else{
        console.log("Greska u promeni boje sobe!");
      }
    });
  }


  // Kada nema dovoljno radnika, potrebno je postaviti boju svih soba na zutu
  notEnoughWorkers(room : Room){
    // TODO
  }



  
  // Proveravamo da li su sve sobe zavrsene, tj. zelene boje
  // Ako jesu tada postavljamo requestStatus na agencyDone, cime signaliziramo da je agencija zavrsila 

  allRoomsDone : boolean;

  allRoomsFinished(){
    let roomArray = this.realEstateUnderRenovation.roomArray;

    console.log("room  array");
    console.log(roomArray);

    let i : number;
    let counter : number = 0;
    for(i = 0; i < roomArray.length; i++){
      
      if(roomArray[i].roomColor == "green"){
        counter++;
      }
    }

    // Broj zelenih soba jednak je ukupnom broju soba
    if(counter == roomArray.length){
      this.allRoomsDone = true;

      this.updateRequestStatusToAgencyDone();     // Ako su sve sobe gotove, azuriraj status na agencyDone
    }
    else{
      this.allRoomsDone = false;
    }

    console.log("Sve sobe gotove?");
    console.log(this.allRoomsDone);

    console.log("Counter?");
    console.log(counter);
  }



  updateRequestStatusToAgencyDone(){
    // Postavi agencyDone
    this.agencyService.setAgencyDone(this.selectedRequest.requestId).subscribe( res => {
      if(res['message'] == 'agencyDoneSet'){
        console.log("Azuriran status zahteva na agencyDone");
      }
    });
  }



  returnToAgencyBusinessPage(){
    localStorage.removeItem('request');
    this.router.navigate(['business']);
  }


}
