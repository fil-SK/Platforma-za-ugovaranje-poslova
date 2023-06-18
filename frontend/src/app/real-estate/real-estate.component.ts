
import { Component, OnInit } from '@angular/core';

// Import ViewChild to access the canvas element in the template
// Import AfterViewInit to implement a lifecycle hook that executes after the view has been initialized
import { ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { IdTracking } from '../models/idTracking';
import { RealEstate } from '../models/realestate';
import { Room } from '../models/room';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.css']
})
export class RealEstateComponent implements OnInit, AfterViewInit {

  @ViewChild('realEstateCanvas', {static: false}) canvasReference;          // Bind canvas ID from HTML to canvasReference variable

  constructor(private clientService : ClientService, private router : Router) { }

  ngAfterViewInit() {
    const canvas : HTMLCanvasElement = this.canvasReference.nativeElement;
    const context = canvas.getContext('2d');

    this.drawRealEstate(context);
    
  }


  ngOnInit(): void {
    this.numberOfRooms = 3;   // Since default schema is displayed on input, it should initially display that number of rooms

    let user = localStorage.getItem('user');
    if(user){
      this.loggedUser = JSON.parse(user);
    }

    this.usingDefaultSchema = true;

    this.allClientRealEstates = [];
    
    this.getAllClientRealEstates();
  }


  allClientRealEstates : RealEstate[];      // All objects for that client



  uploadedSchema;
  usingDefaultSchema : boolean;
  extractedRealEstate : RealEstate = new RealEstate();
  selectedSchema(event){
    
    if(event.target.files.length > 0){
      this.usingDefaultSchema = false;                // Since we are uploading a JSON file, we are not using default schema

      this.uploadedSchema = event.target.files[0];    // Get the JSON file


      // Make a POST request to immediately extract data from the JSON file
      const formData = new FormData();
      formData.append('jsonSchema', this.uploadedSchema);

      // Return JSON object !!! TODO
      this.clientService.uploadJSONSchema(formData).subscribe( (res : RealEstate) => {

        console.log("Vratila se sema sa bekenda!");

        this.extractedRealEstate.ownerUsername = this.loggedUser.username;
        this.extractedRealEstate.type = res.type;
        this.extractedRealEstate.address = res.address;
        this.extractedRealEstate.numberOfRooms = res.numberOfRooms;
        this.extractedRealEstate.squareFootage = res.squareFootage;
        this.extractedRealEstate.doorImagePath = 'http://localhost:4000/uploads/doorVector.png';
        this.extractedRealEstate.roomArray = res.roomArray;
        this.extractedRealEstate.underRenovation = res.underRenovation;

      });

      console.log("Proslo se poziv servisa za upload seme!");
    }

  }


  drawRealEstate(context : CanvasRenderingContext2D){

    // Initial, default, schema of rooms

    context.strokeRect(50, 50, 250, 150);
    context.strokeRect(300, 50, 140, 150);
    context.strokeRect(160, 200, 280, 150);


    const doorImage = new Image();
    doorImage.src = 'http://localhost:4000/uploads/doorVector.png';


    doorImage.onload = function(){
      context.drawImage(doorImage, 220, 160, 25, 40);
      context.drawImage(doorImage, 370, 160, 25, 40);
      context.drawImage(doorImage, 260, 310, 25, 40);
    }

  }

  fillValuesForDefaultRealEstate(){

    // If working with the default schema

    let newRealEstate : RealEstate = new RealEstate();

    newRealEstate.ownerUsername = this.loggedUser.username;
    newRealEstate.type = this.realEstateType;
    newRealEstate.address = this.realEstateAddress + " " + this.realEstateStreetNumber;
    newRealEstate.numberOfRooms = this.numberOfRooms;
    newRealEstate.squareFootage = this.squareFootage;
    newRealEstate.doorImagePath = 'http://localhost:4000/uploads/doorVector.png';

    newRealEstate.underRenovation = false;

    let room1 : Room = new Room();
    room1.roomCoord = {x : 50, y : 50, width : 250, height : 150};
    room1.doorCoord = {x : 220, y : 160, width : 25, height : 40};
    room1.doorPosition = "normal";
    room1.roomColor = 'white';

    let room2 : Room = new Room();
    room2.roomCoord = {x : 300, y : 50, width : 140, height : 150};
    room2.doorCoord = {x : 370, y : 160, width : 25, height : 40};
    room2.doorPosition = "normal";
    room2.roomColor = 'white';

    let room3 : Room = new Room();
    room3.roomCoord = {x : 160, y : 200, width : 280, height : 150};
    room3.doorCoord = {x : 260, y : 310, width : 25, height : 40};
    room3.doorPosition = "normal";
    room3.roomColor = 'white';

    // newRealEstate.ownerUsername = localStorage.getItem('user')

    newRealEstate.roomArray = [];
    newRealEstate.roomArray.push(room1);
    newRealEstate.roomArray.push(room2);
    newRealEstate.roomArray.push(room3);

    return newRealEstate;
  }


  // Real Estate input fields
  realEstateType : string;
  realEstateAddress : string;
  realEstateStreetNumber : string;
  numberOfRooms : number;
  squareFootage : number;

  loggedUser : Client;
  

  // ----------- Za proveru JSON fajla --------------

  checkIfRoomsOverlap(room1 : any, room2 : any){
    // Posmatraju se 4 slucaja, ako je bilo koji od ova 4 uslova TACAN, tada se ove dve sobe NE preklapaju
    // 1. uslov - leva ivica sobe1 nalazi se DESNO od desne ivice sobe2
    // 2. uslov - gornja ivica sobe1 nalazi se ISPOD donje ivice sobe2
    // 3. uslov - desna ivice sobe1 nalazi se LEVO od leve ivice sobe2
    // 4. uslov - donja ivica sobe1 nalazi se IZNAD gornje ivice sobe2

    if(room1.roomCoord.x >= room2.roomCoord.x + room2.roomCoord.width ||
       room1.roomCoord.y >= room2.roomCoord.y + room2.roomCoord.height ||
       room1.roomCoord.x + room1.roomCoord.width <= room2.roomCoord.x ||
       room1.roomCoord.y + room1.roomCoord.height <= room2.roomCoord.y){
          return false;   // Sobe se ne preklapaju
       }
    else{
      return true;    // Sobe se preklapaju
    }
  }


  checkIfRoomsAreTouching(room1 : any, room2 : any){
    // Stranice za sobe
    let room1Left = room1.roomCoord.x;
    let room1Right = room1.roomCoord.x + room1.roomCoord.width;
    let room1Top = room1.roomCoord.y;
    let room1Bottom = room1.roomCoord.y + room1.roomCoord.height;

    let room2Left = room2.roomCoord.x;
    let room2Right = room2.roomCoord.x + room2.roomCoord.width;
    let room2Top = room2.roomCoord.y;
    let room2Bottom = room2.roomCoord.y + room2.roomCoord.height;

    let leftWallTouching;
    let rightWallTouching;
    let topWallTouching;
    let bottomWallTouching;

    // Proveravamo da li dodiruje za levu sobu

    // Provera levog zida leve sobe
    if(room1Left == room2Right && room1Top < room2Bottom && room1Bottom > room2Top){
      leftWallTouching = true;
    }
    else{
      leftWallTouching = false;
    }

    // Provera desnog zida leve sobe
    if(room1Right == room2Left && room1Top < room2Bottom && room1Bottom > room2Top){
      rightWallTouching = true;
    }
    else{
      rightWallTouching = false;
    }

    // Provera gornjeg zida leve sobe
    if(room1Top == room2Bottom && room1Left < room2Right && room1Right > room2Left){
      topWallTouching = true;
    }
    else{
      topWallTouching = false;
    }

    // Provera donjeg zida leve sobe
    if(room1Bottom == room2Top && room1Left < room2Right && room1Right > room2Left){
      bottomWallTouching = true;
    }
    else{
      bottomWallTouching = false;
    }


    return leftWallTouching || rightWallTouching || topWallTouching || bottomWallTouching;
    
  }




  insertRealEstate(form : NgForm){
    
    if(form.invalid && this.usingDefaultSchema){    // Trigger validation check only if using default schema, so rest of data needs to be taken from form

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    // If using the default schema (odradi proveru tako sto ces da vidis da li si dohvatio ista iz input file podatka, ako je to null onda koristis ovu default semu a ako nije onda uzimas podatke iz JSON fajla koji si ucitao)
    let newRealEstate;
    if(this.usingDefaultSchema){
      newRealEstate = this.fillValuesForDefaultRealEstate();
    }
    else{
      newRealEstate = this.extractedRealEstate;
    }
    

    console.log("Uneti svi podaci");
    console.log(newRealEstate);


    let i : number;
    let j : number;

    // Proverimo da li se sobe preklapaju
    for(i = 0; i < newRealEstate.roomArray.length - 1; i++){
      let room1 = newRealEstate.roomArray[i];

      for(j = i + 1; j < newRealEstate.roomArray.length; j++){
        let room2 = newRealEstate.roomArray[j];

        if(this.checkIfRoomsOverlap(room1, room2)){
          alert("Sobe se preklapaju!");
          return;
        }
      }
    }

    // Proverimo da li se sobe dodiruju
    for(i = 0; i < newRealEstate.roomArray.length - 1; i++){
      let room1 = newRealEstate.roomArray[i];
      let isTouching : boolean = false;       // Ovo proveravamo za svaku sobu

      for(j = i + 1; j < newRealEstate.roomArray.length; j++){
        let room2 = newRealEstate.roomArray[j];

        if(this.checkIfRoomsAreTouching(room1, room2)){
          isTouching = true;    // Dodiruju se, to je dobro
          break;
        }

      }

      if(!isTouching){
        alert("Soba ne dodiruje nijednu drugu sobu!");
        return;
      }
    }


    // Proverimo da li su vrata u sobi
    for(i = 0; i < newRealEstate.roomArray.length; i++){
      let room = newRealEstate.roomArray[i];
      let door = room.doorCoord;
      let doorPosition = room.doorPosition;

      if(doorPosition == "normal"){
        // Da li su vrata u sobi
        if(door.x < room.roomCoord.x ||
          door.x + door.width > room.roomCoord.x + room.roomCoord.width ||
          door.y < room.roomCoord.y ||
          door.y + door.height > room.roomCoord.y + room.roomCoord.height){
           alert("Greska! Vrata nisu u sobi!");
           return;
          }
        
        // Da li su vrata oslonjena na zid. Posto se postavljaju kao normal
        // USLOV: Vrata moraju da budu oslonjena na donji zid tj. donji deo vrata mora biti na ISTOJ visini kao i donji deo sobe
        if(door.y + door.height != room.roomCoord.y + room.roomCoord.height){
          alert("Greska za normalna vrata! Vrata ne dodiruju zid!");
          return;
        }
      }

      else if(doorPosition == "reverse"){
        // USLOV: Vrata moraju da budu oslonjena na gornji zid. tj. donji deo mora biti na ISTOJ visini kao i gornji deo sobe
        if(door.x < room.roomCoord.x || door.x + door.width > room.roomCoord.x + room.roomCoord.width ||
           door.y + door.height != room.roomCoord.y){
            alert("Greska za obrnuta vrata! Vrata su izvan granice sobe ili ne dodiruju zid!");
            return;
           }
      }

      else if(doorPosition == "toLeft"){
        // USLOV: Vrata moraju da budu oslonjena sa spoljasnje strane zida u uspravnom polozaju
        // Moraju se naci na istoj x koordinati kao i desni zid, a y koord. vrata mora biti u opsegu (y koord. zida, y koord zida + visina zida - sirina vrata)
        if(door.x != room.roomCoord.x + room.roomCoord.width ||
          door.y < room.roomCoord.y || door.y > room.roomCoord.y + room.roomCoord.height - door.width){
            alert("Greska za vrata ulevo! Vrata su izvan granice sobe ili ne dodiruju zid!");
            return;
          }
      }

      else if(doorPosition == "toRight"){
        // USLOV: Vrata moraju biti iste x koordinate kao i levi zid, a visina vrata mora biti u opsegu (y koord. zida, y koord zida + visina zida - sirina vrata)
        if(door.x != room.roomCoord.x ||
           door.y < room.roomCoord.y || door.y > room.roomCoord.y + room.roomCoord.height - door.width){
            alert("Greska za vrata udesno! Vrata su izvan granice sobe ili ne dodiruju zid!");
            return;
           }
      }
         
    }

    alert("Uspesno dodeljena sema")
    





    // NE ZABORAVI DA ODKOMENTARISES OVAJ DEO DOLE

    
    // U OVAJ DEO MORA DA SE PREDJE JEDINO U SLUCAJU DA JE SVE DOBRO PROSLO, POSTO CE SE DOLE MENJATI ID-evi U BAZI! DOLE NE SME DA DODJE DO GRESKE!

    // Get last used ID values for roomId and realEstateId from the database
    this.clientService.getLastRoomAndRealEstateId().subscribe( (res : IdTracking) => {
      // This always returns an object, because this value always exists in the database
      if(res){

        console.log("dohvaceni podaci iz baze za id");
        console.log(res);

        let lastUsedRoomId = res.roomId;
        let lastUsedRealEstateId = res.realEstateId;



        // For the new real estate that you're inserting, assign the ID values
        let i : number;
        for( i = 0; i < newRealEstate.roomArray.length; i++){
          newRealEstate.roomArray[i].roomId = ++lastUsedRoomId;
        }
        newRealEstate.realEstateId = ++lastUsedRealEstateId;

        console.log("Novi room id je " + lastUsedRoomId + ", a real estate id je " + lastUsedRealEstateId);




        // Update database with last used values
        this.clientService.insertNewLastUsedRoomAndRealEstateId(lastUsedRoomId, lastUsedRealEstateId).subscribe( res => {
          if(res['message'] == 'dbIdUpdated'){
            console.log("Uspesno azuriran ID-evi u bazi podataka!");


            // For this client, update his realEstateArray field by adding another element, which is the realEstateId of this real estate that he's adding
            this.clientService.insertNewRealEstateToClient(this.loggedUser.username ,newRealEstate.realEstateId).subscribe( res => {
              if(res['message'] == 'updatedClient'){
                console.log("Uspesno dodao objekat u bazu za ovog klijenta!");
              }


              // Now add the entire RealEstate object to the realEstate collection
              this.clientService.insertRealEstateIntoCollection(newRealEstate).subscribe( res => {
              if(res['message'] == 'realEstateInserted'){
                console.log("Objekat je uspesno ubacen u realEstate kolekciju!");
                alert('Objekat je uspesno dodat!');

                this.router.navigate(['realEstate']);   // Navigate to the same page, so that init is done again and new object is visible in the list of all objects
                this.ngOnInit();                        // Reinitialize component
              }

              });

            });

          }

        });

      }
    });
    
  }



  getAllClientRealEstates(){

    this.clientService.getAllRealEstatesForClient(this.loggedUser.username).subscribe( (allRealEstates : RealEstate[]) => {

      this.allClientRealEstates = allRealEstates;

      console.log("Prikazi sve vracene objekte u frontendu:");
      console.log(this.allClientRealEstates);
    });

  }



  goToRealEstatePage(selectedRealEstate){
    // Upon clicking on particular real estate, add that real estate to local storage
    // Then redirect to the component which will display all the details and functionalities with that real estate

    localStorage.setItem('selectedRealEstate', JSON.stringify(selectedRealEstate));   // Save real estate in local storage
    this.router.navigate(['realEstateDetails']);
  }
}
