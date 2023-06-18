import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RealEstate } from '../models/realestate';


// Import ViewChild to access the canvas element in the template
// Import AfterViewInit to implement a lifecycle hook that executes after the view has been initialized
import { ViewChild, AfterViewInit } from '@angular/core';




@Component({
  selector: 'app-full-real-estate-details',
  templateUrl: './full-real-estate-details.component.html',
  styleUrls: ['./full-real-estate-details.component.css']
})
export class FullRealEstateDetailsComponent implements OnInit, AfterViewInit {


  @ViewChild('displayRealEstateSchemaCanvas', {static: false}) realEstateCanvasReference;          // Bind canvas ID from HTML to canvasReference variable



  constructor(private router : Router) { }

  ngOnInit(): void {

    this.getRealEstateFromLocalStorage();
    
  }



  ngAfterViewInit(): void {
    
    const canvas : HTMLCanvasElement = this.realEstateCanvasReference.nativeElement;
    const context = canvas.getContext('2d');

    this.displayRealEstateDetails(context);
  }



  selectedRealEstate : RealEstate;


  getRealEstateFromLocalStorage(){
    let realEstate = localStorage.getItem('selectedRealEstate');
    if(realEstate){
      this.selectedRealEstate = JSON.parse(realEstate);
    }
  }

/*
  displayRealEstateDetails(context : CanvasRenderingContext2D){
    let doorImagePath = this.selectedRealEstate.doorImagePath;
    context.strokeRect(150, 250, 200, 100);
    

    


    const doorImage = new Image();
      doorImage.src = 'http://localhost:4000/uploads/doorVector.png';

      doorImage.onload = function(){
        context.translate(280, 210); //200 - 325
        context.rotate(Math.PI);
        context.drawImage(doorImage, -25, -80, 25, 40);
      }
    
  }*/
  
  displayRealEstateDetails(context : CanvasRenderingContext2D){

    let doorImagePath = this.selectedRealEstate.doorImagePath;
    let allRooms = this.selectedRealEstate.roomArray;

    //context.strokeRect(50, 50, 250, 150);
    //context.strokeRect(300, 50, 140, 150);
    //context.strokeRect(160, 200, 280, 150);


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




  returnToRealEstatePage(){
    // Upon return from that page, remove real estate from the local storage, then navigate to realEstate page

    localStorage.removeItem('selectedRealEstate');

    this.router.navigate(['realEstate']);
  }
}
