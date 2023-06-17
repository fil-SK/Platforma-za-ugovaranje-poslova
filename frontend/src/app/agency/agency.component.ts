import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.loggedAgency = JSON.parse(localStorage.getItem('user'));
  }


  loggedAgency : Agency;
}
