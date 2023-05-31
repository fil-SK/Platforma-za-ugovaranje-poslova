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
}
