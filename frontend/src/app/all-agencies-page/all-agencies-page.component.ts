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

  searchParam : string;
  searchByName : boolean;
  searchByAddress : boolean;



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
      // Pretrazuj po oba parametra
    }
    else if(this.searchByName && !(this.searchByAddress)){
      // Seach by name only
      this.clientService.searchAgenciesByName(this.searchParam).subscribe( () => {
        // TODO
      });
    }
    else{
      // Pretrazuj po adresi
    }
  }

}
