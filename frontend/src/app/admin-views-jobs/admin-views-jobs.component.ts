import { Component, Input, OnInit } from '@angular/core';
import { Request } from '../models/request';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { RealEstate } from '../models/realestate';
import { ClientService } from '../services/client.service';

import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-admin-views-jobs',
  templateUrl: './admin-views-jobs.component.html',
  styleUrls: ['./admin-views-jobs.component.css']
})
export class AdminViewsJobsComponent implements OnInit, AfterViewInit {


  @ViewChild('displayRealEstateSchema', {static : false}) realEstateCanvasReference;

  constructor(private router : Router, private adminService : AdminService, private clientService : ClientService) { }

  ngOnInit(): void {
    this.adminService.getRequestWithThisId(Number.parseInt(localStorage.getItem('adminRequestRequestId')) ).subscribe( (request : Request) => {
      this.selectedRequest = request;

      this.clientService.getRealEstateForThisId(this.selectedRequest.realEstateId).subscribe( (realEstate : RealEstate) => {
        this.selectedRealEstate = realEstate;

        this.ngAfterViewInit();   // Mora da se pozove ponovo posto on pokusa poziv pre nego sto se dohvati objekat iz baze
      });

    });

    this.agencyName = localStorage.getItem('adminRequestAgencyName');
    this.clientFirstAndLastName = localStorage.getItem('adminRequestClientName');
    this.requestDate = localStorage.getItem('adminRequestDate');
  }


  ngAfterViewInit(): void {
    
    const canvas : HTMLCanvasElement = this.realEstateCanvasReference.nativeElement;
    const context = canvas.getContext('2d');

    this.displayRealEstate(context);
  }




  selectedRequest : Request;
  agencyName : string;
  clientFirstAndLastName : string;
  requestDate : string;
  selectedRealEstate : RealEstate;



  displayRealEstate(context : CanvasRenderingContext2D){

    let doorImagePath = this.selectedRealEstate.doorImagePath;
    let allRooms = this.selectedRealEstate.roomArray;
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






  returnToAdminPage(){
    localStorage.removeItem('adminRequestClientName');
    localStorage.removeItem('adminRequestAgencyName');
    localStorage.removeItem('adminRequestRequestId');
    localStorage.removeItem('adminRequestDate');

    this.router.navigate(['admin']);
  }
}
