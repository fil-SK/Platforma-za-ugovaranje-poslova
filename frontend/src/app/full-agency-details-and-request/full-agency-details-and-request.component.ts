import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agency } from '../models/agency';
import { Review } from '../models/review';
import { Client } from '../models/client';
import { RealEstate } from '../models/realestate';
import { ClientService } from '../services/client.service';
import { NgForm } from '@angular/forms';
import { IdTracking } from '../models/idTracking';
import { Request } from '../models/request';
import { AgencyService } from '../services/agency.service';

@Component({
  selector: 'app-full-agency-details-and-request',
  templateUrl: './full-agency-details-and-request.component.html',
  styleUrls: ['./full-agency-details-and-request.component.css']
})
export class FullAgencyDetailsAndRequestComponent implements OnInit {

  constructor(private clientService : ClientService, private router : Router, private agencyService : AgencyService) { }

  ngOnInit(): void {

    this.getLoggedUserFromLocalStorage();
    this.getAgencyFromLocalStorage();

    this.getAllRequestsWithReviews();     // Da dohvatimo sve poslove
    this.mapClientUsernamesToNames();
  }


  loggedUser : Client;                                      // Ulogovani korisnik (klijent)
  selectedAgency : Agency;                                  // Agencija iz local Storage-a, ona se prikazuje na ovoj stranici
  
  allClientRealEstates : RealEstate[] = [];                 // Za klijenta iz baze dohvatamo sve njegove objekte i cuvamo ih ovde
  realEstateHashMap = new Map<string, number>();            // Sadrzi parove (string, realEstateId) - koristice se za dohvatanje realEstateId-a, za odabranu vrednost iz dropdown liste
  stringList : string[] = [];                               // Nazivi za objekte, koje cu koristiti u drop down listi, lakse mi da radim ovako
  
  selectedRealEstate : string;                              // Ovde se cuva odabrana vrednost iz drop down liste
  selectedRealEstateId : number;                            // ID od odabranog objekta iz drop down liste
  startingDate : Date;                                      // Klijent unosi datum pocetka i datum kraja radova
  endingDate : Date;
  inputStartDate;
  inputEndDate;

  error : string;                                           // For displaying error messages

  allAgencyRequestsWithReviews : Request[] = [];            // Dovlacimo sve zahteve / poslove te agencije koji imaju recenzije. Ovo nam treba da bismo formirali allReviews polje
  allReviews = new Map<number, Review>();                   // Hes mapa gde cuvamo parove (requestId, review)
  mapClientToReview = new Map<number, string>();            // Hes mapa gde cuvamo parove (requestId, client username)

  allClientUsernames : String[] = [];                       // Niz svih username-ova klijenata   
  allClientNames : String[] = [];                           // Niz svih imena i prezimena klijenata
  mapUsernameToName = new Map<string, string>();            // Hes mapa gde cuvamo 

  noReviews : boolean;                                      // Da li se prikazuje poruka kada nema recenzija


  getLoggedUserFromLocalStorage(){
    let user = localStorage.getItem('user');
    if(user){
      this.loggedUser = JSON.parse(user);

      this.getAllClientRealEstates();
    }
  }

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


  getAllClientRealEstates(){
    this.clientService.getAllRealEstatesForClient(this.loggedUser.username).subscribe( (allRealEstates : RealEstate[]) => {
      this.allClientRealEstates = allRealEstates;

      let arrayToFilter = allRealEstates;

      this.allClientRealEstates = arrayToFilter.filter( (estate) => {return estate.underRenovation == false} );

      this.prepareRealEstatesForDropDownList();     // Pozovi metodu tek nakon sto se svi podaci dohvate
    });
  }



  prepareRealEstatesForDropDownList(){
    let realEstates = this.allClientRealEstates;

    let i : number;
    for(i = 0; i < realEstates.length; i++){
      this.stringList[i] = realEstates[i].type + ", " + realEstates[i].address + ", " + realEstates[i].numberOfRooms + ", " + realEstates[i].squareFootage;

      this.realEstateHashMap.set(this.stringList[i], realEstates[i].realEstateId);   // To fill the drop down list
    }

  }


  getRealEstateId(){
    // Ova funkcija se poziva iz drop down liste po odabiru opcije
    // Za dohvacenu vrednost zelim da iz hes mape izvucem realEstateId
    this.selectedRealEstateId = this.realEstateHashMap.get(this.selectedRealEstate);
  }


  makeRequest(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    // Take date from the form
    this.startingDate = new Date(this.inputStartDate);
    this.endingDate = new Date(this.inputEndDate);

    console.log("Datum");
    console.log(this.startingDate);

    let today : Date = new Date();
    today.setHours(0, 0, 0, 0,);      // For the comparison - essentially compare the date part only
    this.startingDate.setHours(0, 0, 0, 0);
    this.endingDate.setHours(0, 0, 0, 0);

    // Check if starting date is in past - error
    if (this.startingDate.getTime() < today.getTime() || this.endingDate.getTime() < today.getTime()) {
      this.error = "Datum ne sme biti u proslosti!";
      return;
    }
    else{
      this.error = "";
    }


    // Napravi u kolekciji red gde ces voditi evidenciju o requestId

    let newRequestId : number;
    // Dohvati poslednji request ID (vidi da li u bazi cuvas slobodan ili zauzet) - cuvam zauzet
    this.clientService.getLastRequestId().subscribe( (idData : IdTracking) => {

      newRequestId = ++idData.requestId;


      // Pripremi request objekat koji treba da posaljes na bazu
      const requestData = {
        requestId : newRequestId,

        agencyUsername : this.selectedAgency.username,
        clientUsername : this.loggedUser.username,

        realEstateId : this.selectedRealEstateId,
        startDate : this.startingDate,
        endDate : this.endingDate,

        clientRequestStatus : 'clientRequested',
        requestStatus : 'awaitingApproval'
      };

      this.clientService.insertRequestIntoDatabase(requestData).subscribe( res => {

        if(res['message'] == 'error'){
          console.log("Greska pri podnosenju zahteva!");
        }
        else if(res['message'] == 'requestSent'){
          console.log("Uspesno unet zahtev u bazu!");
        }


        // Azuriraj da je objekat pod renoviranjem, kako ne bi mogao da se odabere ponovo dok se ne zavrsi
        this.clientService.markRealEstateForRenovation(this.selectedRealEstateId).subscribe( res => {
          if(res['message'] == 'realEstateMarked'){
            console.log("Objekat je uspesno oznacen kao pod renoviranjem!");


            // Azuriraj requestId u bazi
            this.clientService.insertNewRequestIdIntoDatabase(newRequestId).subscribe( res => {
              if(res['message'] == 'updatedRequestId'){
                console.log("Uspesno azuriran requestId u bazi!");

                alert('Uspesno poslat zahtev!');
                
                this.returnToAllAgenciesPage();                        // Redirect to allAgencies page
              }

            });

          }
        });

      });

    });

  }


  // Da dohvatimo sve poslove kako bismo mogli da ocitamo recenzije
  getAllRequestsWithReviews(){
    this.agencyService.getAllRequestsWithReviews(this.selectedAgency.username).subscribe( (requests : Request[]) => {
      
      if(requests.length > 0){   // Ako ima recenzije radimo ovo, inace ne radimo
        this.noReviews = false;

        this.allAgencyRequestsWithReviews = requests;


        // Sad prolazimo kroz ovu kolekciju i izdvajamo sve recenzije. Ako recenzija postoji, dodaj je u hesmapu
        let i : number;
        for(i = 0; i < requests.length; i++){
            this.allReviews.set(requests[i].requestId, requests[i].review);
            this.mapClientToReview.set(requests[i].requestId, requests[i].clientUsername);
        }
  
        // Prikaz sadrzaja hes mape
        this.allReviews.forEach((value, key) => {
          console.log(`Key: ${key}, Value: ${value}`);
        });
      }
      
      else{
        this.noReviews = true;
      }


    });
  }

  // Dohvatamo puna imena svih klijenata zato sto ce nam biti potrebna kasnije kada budemo prikazivali recenzije

  mapClientUsernamesToNames(){
    this.clientService.getAllClientUsernames().subscribe( (usernames : String[]) => {
      this.allClientUsernames = usernames;

      this.clientService.getAllClientFullNames().subscribe( (fullNames : String[]) => {
        this.allClientNames = fullNames;

        let i : number;
        for(i = 0; i < fullNames.length; i++){
          this.mapUsernameToName.set(this.allClientUsernames[i].toString(), this.allClientNames[i].toString());
        }
      });
    });
  }



  displayClientName(requestId : number){

    if(this.loggedUser == null){
      return "Depersonalizovan"
    }
    
    // Za taj requestId dohvati username klijenta
    let clientUsername = this.mapClientToReview.get(requestId);

    // Za taj username klijenta dohvati njegovo ime
    return this.mapUsernameToName.get(clientUsername);
  }


  returnToAllAgenciesPage(){
    localStorage.removeItem('selectedAgency');
    this.router.navigate(['allAgenciesPage']);
  }
}
