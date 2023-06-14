import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Request } from '../models/request';
import { RealEstate } from '../models/realestate';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client';
import { Worker } from '../models/worker';

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

      // Ipak je bolje da dohvatis iz baze sveze podatke!
      this.agencyService.getAgencyWithUsername(this.loggedAgency.username).subscribe((res : Agency) => {
        this.loggedAgency = res;
      });

    }
  }


  getRequestFromLocalStorage(){
    let request = localStorage.getItem('request');
    if(request){
      this.selectedRequest = JSON.parse(request);

      // Ipak dohvati request iz baze!
      this.clientService.getRequestWithThisId(this.selectedRequest.requestId).subscribe( (res : Request) => {
        this.selectedRequest = res;
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

      this.setFormForWorkers();     // Posto sam dohvatio objekat, onda mogu da postavim i elemente forme za dodelu radnika

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
  // Ova metoda ce se pozvati tamo gde se proveri da nema dovoljno radnika, i iziterirace se za svaku sobu i pozvati ova metoda
  notEnoughWorkers(room : Room, roomColor : string){
    
    let roomId = room.roomId;

      this.agencyService.changeRoomColor(roomId, roomColor).subscribe( res => {
        if(res['message'] == 'roomUpdated'){
          console.log("Uspesno promenjena boja sobe!");
          //alert('Uspesno zavrseni radovi na sobi!');

          //this.ngOnInit();
          //this.router.navigate(['agencyFullRequest']);
        }
        else{
          console.log("Greska u promeni boje sobe!");
        }
      });
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



  // ------------- Deo za dodeljivanje radnika START ------------------

  localWorkersIdArray : Number[] = [];                              // Niz ID-jeva svih radnika, dohvacen iz ulogovane agencije
  localWorkersObjectsArray : Worker[] = [];                         // Niz objekata radnika, dohvacen iz kolekcije workers
  notEnoughWorkersForRealEstate : boolean;                          // Flag koji postavljamo ako ova agencija nema dovoljan broj radnika koji treba dodeliti objektu

  selectedRoomFromRadio : number;                                   // Vrednost u kojoj se cuva koji radio button je odabran
  selectedWorkerFromDDList : number;                                // Radnik koji je odabran iz padajuce liste

  // Ova tri niza cuvaju ID-jeve radnika koji su dodeljeni konkretnoj sobi
  workersRoom1 : Number[] = [];
  workersRoom2 : Number[] = []; 
  workersRoom3 : Number[] = [];

  allWorkersCombined :Number[] = [];        // Ovaj niz cuva ID-jeve SVIH radnika koji su dodeljeni za rad tom objektu



  setFormForWorkers(){
    // Dohvati sve radnike agencije
    this.localWorkersIdArray = this.loggedAgency.workersArray;     // Niz ID-jeva svih radnika, ali ja zelim da prikazem radnike kao Ime+Prezime+Profesija



    this.agencyService.getAllWorkersAsObjects(this.loggedAgency.username, this.loggedAgency.workersArray).subscribe( (res : Worker[]) => {
      this.localWorkersObjectsArray = res;


      // Proveravamo da li agencija ima dovoljan broj radnika
      if(this.localWorkersObjectsArray.length < this.realEstateUnderRenovation.numberOfRooms){
        this.notEnoughWorkersForRealEstate = true;



        // Proveri da li je niz radnika nedefinisan ili je duzine 0
        // Ako jeste, to znaci da manjak radnika nije zato sto smo ih dodavali pa su se smanjivali u listi, vec bukvalno nema dovoljno radnika
        if(this.selectedRequest.allWorkers === undefined || this.selectedRequest.allWorkers.length == 0){

          // Ali prvo proveri da li su zidovi vec postavljeni na zutu boju - ako jesu ne treba to da radis ponovo
          let yellowCounter : number = 0;
          let i : number;

          for(i = 0; i < this.realEstateUnderRenovation.roomArray.length; i++){
            if(this.realEstateUnderRenovation.roomArray[i].roomColor == 'yellow'){
              yellowCounter++;
            }
          }

          if(yellowCounter == this.realEstateUnderRenovation.roomArray.length){
            // Ne radi nista, vec su obojene u zuto
          }
          else{
            // Oboj u zuto svaku sobu
            for(i = 0; i < this.realEstateUnderRenovation.roomArray.length; i++){
              this.notEnoughWorkers(this.realEstateUnderRenovation.roomArray[i], 'yellow');
            }

            this.ngOnInit();    // Ponovo inicijalizuj komponentu da bi se to videlo
          }

        }

      }

      else{
        this.notEnoughWorkersForRealEstate = false;

        // Ima dovoljno radnika i jos nijedan nije dodat - dakle na pocetku si
        if(this.selectedRequest.allWorkers === undefined || this.selectedRequest.allWorkers.length == 0){

          // Da li su zidovi vec postavljeni na belu boju - ako jesu ne radi to ponovo
          let whiteCounter : number = 0;
          let i : number;

          for(i = 0; i < this.realEstateUnderRenovation.roomArray.length; i++){
            if(this.realEstateUnderRenovation.roomArray[i].roomColor == 'white'){
              whiteCounter++;
            }
          }

          if(whiteCounter == this.realEstateUnderRenovation.roomArray.length){
            // Ne radi nista, vec su obojene u belo
          }
          else{
            // Bile su zute ali sada ima dovoljno radnika pa treba da obojimo u belo

            for(i = 0; i < this.realEstateUnderRenovation.roomArray.length; i++){
              this.notEnoughWorkers(this.realEstateUnderRenovation.roomArray[i], 'white');
            }

            this.ngOnInit();    // Ponovo inicijalizuj komponentu da bi se to videlo
          }


        }
      }

    });
  }

  assignWorker(){
    alert("Odabrana soba " + this.selectedRoomFromRadio + " a odabran radnik je " + this.selectedWorkerFromDDList);

    // Odabranog radnika dodati u odgovarajuci niz, a tog radnika izbaciti iz niza svih radnika iz liste
    let workerIndex;    // Indeks radnika kojeg zelimo da izbacimo iz niza localWorkersObjectsArray

    if(this.selectedRoomFromRadio == 1){
      this.workersRoom1.push(this.selectedWorkerFromDDList);

      workerIndex = this.localWorkersObjectsArray.findIndex( searchedWorker => searchedWorker.workerId == this.selectedWorkerFromDDList);
      this.localWorkersObjectsArray.splice(workerIndex, 1);   // Izbaci jedan element pocevsi od ovog indeksa (efektivno izbacujemo samo tog radnika)
    }
    else if(this.selectedRoomFromRadio == 2){
      this.workersRoom2.push(this.selectedWorkerFromDDList);

      workerIndex = this.localWorkersObjectsArray.findIndex( searchedWorker => searchedWorker.workerId == this.selectedWorkerFromDDList);
      this.localWorkersObjectsArray.splice(workerIndex, 1);
    }
    else if(this.selectedRoomFromRadio == 3){
      this.workersRoom3.push(this.selectedWorkerFromDDList);

      workerIndex = this.localWorkersObjectsArray.findIndex( searchedWorker => searchedWorker.workerId == this.selectedWorkerFromDDList);
      this.localWorkersObjectsArray.splice(workerIndex, 1);
    }

  }

  finishAssignmentOfWorkers(){

    let numOfRooms = this.realEstateUnderRenovation.numberOfRooms;

    // Moramo da proverimo da li svaka soba ima BAR JEDNOG radnika
    if(numOfRooms == 1){

      if(this.workersRoom1.length == 0){
        alert("Greska! Nedovoljno radnika je dodeljeno objektu!");
      }

      else{
        // Dodaj radnike u celokupni niz radnika
        this.allWorkersCombined.push(...this.workersRoom1);
        console.log("Svi radnici su " + this.allWorkersCombined);

        // Sad ovaj niz treba dodati u request u kolekciji a ukloniti ih iz spiska radnika agencije
        this.agencyService.assignWorkersToRequestCollection(this.selectedRequest.requestId, this.allWorkersCombined).subscribe( res => {
          if(res['message'] == 'allWorkersAssignedToRequest'){

            // Uspesno dodato u request kolekciju, sada ih ukloni iz agencije
            this.agencyService.deleteWorkersFromAgency(this.loggedAgency.username, this.allWorkersCombined).subscribe( resp => {
              if(resp['message'] == 'workersDeletedFromAgency'){

                alert("Uspesno zavrsena dodela radnika!");

                this.ngOnInit();
              }
            });
          }
        });

      }
    }

    else if(numOfRooms == 2){

      if(this.workersRoom1.length == 0 || this.workersRoom2.length == 0){
        alert("Greska! Nedovoljno radnika je dodeljeno objektu!");
      }

      else{
        // Dodaj radnike u celokupni niz radnika
        this.allWorkersCombined = this.workersRoom1.concat(this.workersRoom2);
        console.log("Svi radnici su " + this.allWorkersCombined);

        // Sad ovaj niz treba dodati u request u kolekciji a ukloniti ih iz spiska radnika agencije
        this.agencyService.assignWorkersToRequestCollection(this.selectedRequest.requestId, this.allWorkersCombined).subscribe( res => {
          if(res['message'] == 'allWorkersAssignedToRequest'){

            // Uspesno dodato u request kolekciju, sada ih ukloni iz agencije
            this.agencyService.deleteWorkersFromAgency(this.loggedAgency.username, this.allWorkersCombined).subscribe( resp => {
              if(resp['message'] == 'workersDeletedFromAgency'){

                alert("Uspesno zavrsena dodela radnika!");

                this.ngOnInit();
              }
            });
          }
        });

      }
    }

    else if(numOfRooms == 3){

      if(this.workersRoom1.length == 0 || this.workersRoom2.length == 0 || this.workersRoom3.length == 0){
        alert("Greska! Nedovoljno radnika je dodeljeno objektu!");
      }

      else{
        // Dodaj radnike u celokupni niz radnika
        this.allWorkersCombined = this.workersRoom1.concat(this.workersRoom2, this.workersRoom3);
        console.log("Svi radnici su " + this.allWorkersCombined);


        // Sad ovaj niz treba dodati u request u kolekciji a ukloniti ih iz spiska radnika agencije
        this.agencyService.assignWorkersToRequestCollection(this.selectedRequest.requestId, this.allWorkersCombined).subscribe( res => {
          if(res['message'] == 'allWorkersAssignedToRequest'){

            // Uspesno dodato u request kolekciju, sada ih ukloni iz agencije
            this.agencyService.deleteWorkersFromAgency(this.loggedAgency.username, this.allWorkersCombined).subscribe( resp => {
              if(resp['message'] == 'workersDeletedFromAgency'){

                alert("Uspesno zavrsena dodela radnika!");

                this.ngOnInit();
              }
            });
          }
        });

      }
    }


  }

  // ------------- Deo za dodeljivanje radnika END ------------------




  returnToAgencyBusinessPage(){
    localStorage.removeItem('request');
    this.router.navigate(['business']);
  }


}
