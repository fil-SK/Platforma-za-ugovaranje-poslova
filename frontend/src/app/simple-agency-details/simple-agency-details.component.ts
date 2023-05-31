import { Component, Input, OnInit } from '@angular/core';
import { Agency } from '../models/agency';

@Component({
  selector: 'app-simple-agency-details',
  templateUrl: './simple-agency-details.component.html',
  styleUrls: ['./simple-agency-details.component.css']
})
export class SimpleAgencyDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  @Input() agencyInstance : Agency;

  getImageUrl(){
    const backendUri = "http://localhost:4000";

    const pathBackslash = this.agencyInstance.imagePath;
    const imagePathForwardSlash = pathBackslash.replace(/\\/g, '/');    // Path is saved with backslash but I need to use forward slash, so replace them

    console.log(imagePathForwardSlash);                                 // Logging to check if path is good
   
    return `${backendUri}/${imagePathForwardSlash}`;                    // Return the path to the image for the logged user
  }
}
