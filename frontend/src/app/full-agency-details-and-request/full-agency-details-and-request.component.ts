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


  returnToAllAgenciesPage(){
    localStorage.removeItem('selectedAgency');
    this.router.navigate(['allAgenciesPage']);
  }
}
