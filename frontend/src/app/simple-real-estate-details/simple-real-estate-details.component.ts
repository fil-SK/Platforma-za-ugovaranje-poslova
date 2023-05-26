import { Component, Input, OnInit } from '@angular/core';
import { RealEstate } from '../models/realestate';

@Component({
  selector: 'app-simple-real-estate-details',
  templateUrl: './simple-real-estate-details.component.html',
  styleUrls: ['./simple-real-estate-details.component.css']
})
export class SimpleRealEstateDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  @Input() realEstateInstance : RealEstate;
}
