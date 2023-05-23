
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

  let room1 : Room = new Room();
  room1.roomCoord = {x : 50, y : 50, width : 250, height : 150};
  room1.doorCoord = {x : 220, y : 160, width : 25, height : 40};
  room1.roomColor = 'white';

  let room2 : Room = new Room();
  room2.roomCoord = {x : 300, y : 50, width : 140, height : 150};
  room2.doorCoord = {x : 370, y : 160, width : 25, height : 40};
  room2.roomColor = 'white';

  let room3 : Room = new Room();
  room3.roomCoord = {x : 160, y : 200, width : 280, height : 150};
  room3.doorCoord = {x : 260, y : 310, width : 25, height : 40};
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
  


  insertRealEstate(form : NgForm){
    
    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    // If using the default schema (odradi proveru tako sto ces da vidis da li si dohvatio ista iz input file podatka, ako je to null onda koristis ovu default semu a ako nije onda uzimas podatke iz JSON fajla koji si ucitao)
    let newRealEstate = this.fillValuesForDefaultRealEstate();

    console.log("Uneti svi podaci");
    console.log(newRealEstate);


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
              }

              });

            });

          }

        });

      }
    });
    
  }
}
