import { Component, Input, OnInit } from '@angular/core';
import { Request } from '../models/request';

@Component({
  selector: 'app-agency-request-simple',
  templateUrl: './agency-request-simple.component.html',
  styleUrls: ['./agency-request-simple.component.css']
})
export class AgencyRequestSimpleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.formatDate();
  }



  @Input() requestInstance : Request;

  requestStartDate : string;       // Ovde cu sacuvati formatiran izgled datuma koji zelim da prikazem
  requestEndDate : string; 



  formatDate(){

    // Convert to Date format
    let startDate = new Date(this.requestInstance.startDate);
    let endDate = new Date(this.requestInstance.endDate);

    let day = startDate.getDate();
    let month = startDate.getMonth() + 1;
    let year = startDate.getFullYear();

    this.requestStartDate = year + "-" + month + "-" + day;


    day = endDate.getDate();
    month = endDate.getMonth() + 1;
    year = endDate.getFullYear();

    this.requestEndDate = year + "-" + month + "-" + day;
  }
}
