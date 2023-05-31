import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';
import { ClientService } from '../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-agencies-page',
  templateUrl: './all-agencies-page.component.html',
  styleUrls: ['./all-agencies-page.component.css']
})
export class AllAgenciesPageComponent implements OnInit {

  constructor(private clientService : ClientService, private router : Router) { }

  ngOnInit(): void {
    this.getAllAgencies();
  }


  allAgencies : Agency[];

  searchParamName : string;
  searchParamStreet : string;
  searchParamStreetNumber : string;
  searchByName : boolean;
  searchByAddress : boolean;

  dropDownListValues : string[] = [
    'nazivu nerastuce',
    'nazivu neopadajuce',
    'adresi nerastuce',
    'adresi neopadajuce',
    'nazivu i adresi nerastuce',
    'nazivu i adresi neopadajuce'
  ];
  dropDownSelectedValue : string;

  error : string;



  getAllAgencies(){
    this.clientService.getAllAgencies().subscribe( (listOfAgencies : Agency[]) => {
      this.allAgencies = listOfAgencies;

      console.log("Dohvacene agencije: ");
      console.log(listOfAgencies);
    });
  }



  goToAgencyPage(clickedAgency){
    localStorage.setItem('selectedAgency', JSON.stringify(clickedAgency));
    this.router.navigate(['agencyDetailsAndRequest']);
  }


  searchForAgencies(){
    if(this.searchByName && this.searchByAddress){
      // Search by both name and address
      this.clientService.searchAgencyByNameAndAddress(this.searchParamName, this.searchParamStreet, this.searchParamStreetNumber).subscribe( (res : any) => {
        if(res['message'] == 'noAgencies'){
          this.error = "Ne postoje agencije sa ovim imenom i adresom!";
        }
        else{
          this.allAgencies = res;
        }
      });
    }

    else if(this.searchByName && !(this.searchByAddress)){
      // Seach by name only
      this.clientService.searchAgenciesByName(this.searchParamName).subscribe( (res : any) => {
        if(res['message'] == 'noAgencies'){
          this.error = "Ne postoje agencije sa ovim imenom!";
        }
        else{
          this.allAgencies = res;
        }
      });
    }

    else if(this.searchByAddress && !(this.searchByName)){
      // Search by address only
      this.clientService.searchAgencyByAddress(this.searchParamStreet, this.searchParamStreetNumber).subscribe( (res : any) => {
        if(res['message'] == 'noAgencies'){
          this.error = "Ne postoje agencije na ovoj adresi!";
        }
        else{
          this.allAgencies = res;
        }
      });
    }
  }


  sortAgencies(){
    if(this.dropDownSelectedValue == "nazivu neopadajuce"){
      this.allAgencies.sort( (a, b) => a.agencyName.localeCompare(b.agencyName));
    }

    else if(this.dropDownSelectedValue == "nazivu nerastuce"){
      this.allAgencies.sort( (a, b) => b.agencyName.localeCompare(a.agencyName));
    }

    else if(this.dropDownSelectedValue == "adresi neopadajuce"){
      this.allAgencies.sort( (a, b) => {
        let aAddress = a.streetAddress + " " + a.streetNumber;
        let bAddress = b.streetAddress + " " + b.streetNumber;

        return aAddress.localeCompare(bAddress);
      });
    }

    else if(this.dropDownSelectedValue == "adresi nerastuce"){
      this.allAgencies.sort( (a, b) => {
        let aAddress = a.streetAddress + " " + a.streetNumber;
        let bAddress = b.streetAddress + " " + b.streetNumber;

        return bAddress.localeCompare(aAddress);
      });
    }

    else if(this.dropDownSelectedValue == "nazivu i adresi neopadajuce"){
      // First sort by name, if  names are equal then sort by address
      this.allAgencies.sort( (a, b) => {
        let aAddress = a.streetAddress + " " + a.streetNumber;
        let bAddress = b.streetAddress + " " + b.streetNumber;

        if(a.agencyName != b.agencyName){
          return a.agencyName.localeCompare(b.agencyName);
        }
        else{
          return aAddress.localeCompare(bAddress);
        }
      });
    }

    else if(this.dropDownSelectedValue == "nazivu i adresi nerastuce"){
      // First sort by name, if  names are equal then sort by address
      this.allAgencies.sort( (a, b) => {
        let aAddress = a.streetAddress + " " + a.streetNumber;
        let bAddress = b.streetAddress + " " + b.streetNumber;

        if(a.agencyName != b.agencyName){
          return b.agencyName.localeCompare(a.agencyName);
        }
        else{
          return bAddress.localeCompare(aAddress);
        }
      });
    }
  }

}
