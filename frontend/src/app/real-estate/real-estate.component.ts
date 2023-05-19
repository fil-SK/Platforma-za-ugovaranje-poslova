import { Component, OnInit } from '@angular/core';

// Import ViewChild to access the canvas element in the template
// Import AfterViewInit to implement a lifecycle hook that executes after the view has been initialized
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.css']
})
export class RealEstateComponent implements OnInit, AfterViewInit {

  @ViewChild('realEstateCanvas', {static: false}) canvasReference;          // Bind canvas ID from HTML to canvasReference variable

  constructor() { }

  ngAfterViewInit() {
    const canvas : HTMLCanvasElement = this.canvasReference.nativeElement;
    const context = canvas.getContext('2d');


    context.fillStyle = 'red';
    context.fillRect(50, 50, 250, 100);

    context.fillRect(250, 50, 50, 100);
  }


  ngOnInit(): void {
  }



  // Real Estate input fields
  realEstateType : string;
  realEstateAddress : string;
  realEstateStreetNumber : string;
  numberOfRooms : number;
  squareFootage : number;


}
