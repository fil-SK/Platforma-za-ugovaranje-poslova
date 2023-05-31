import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Review } from '../models/review';

@Component({
  selector: 'app-full-agency-details-and-request',
  templateUrl: './full-agency-details-and-request.component.html',
  styleUrls: ['./full-agency-details-and-request.component.css']
})
export class FullAgencyDetailsAndRequestComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {

    this.getAgencyFromLocalStorage();

  }


  selectedAgency : Agency;
  agencyReviews : Review[] = [];


  getAgencyFromLocalStorage(){
    let agency = localStorage.getItem('selectedAgency');
    if(agency){
      this.selectedAgency = JSON.parse(agency);
    }
  }

  getImageUrl(){
    const backendUri = "http://localhost:4000";

    const pathBackslash = this.selectedAgency.imagePath;
    const imagePathForwardSlash = pathBackslash.replace(/\\/g, '/');    // Path is saved with backslash but I need to use forward slash, so replace them

    console.log(imagePathForwardSlash);                                 // Logging to check if path is good
   
    return `${backendUri}/${imagePathForwardSlash}`;                    // Return the path to the image for the logged user
  }


  returnToAllAgenciesPage(){
    localStorage.removeItem('selectedAgency');
    this.router.navigate(['allAgenciesPage']);
  }
}
