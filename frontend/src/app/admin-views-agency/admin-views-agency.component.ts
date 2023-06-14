import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgencyService } from '../services/agency.service';
import { Agency } from '../models/agency';
import { AdminService } from '../services/admin.service';
import { NgForm } from '@angular/forms';
import { IdTracking } from '../models/idTracking';
import { Worker } from '../models/worker';

@Component({
  selector: 'app-admin-views-agency',
  templateUrl: './admin-views-agency.component.html',
  styleUrls: ['./admin-views-agency.component.css']
})
export class AdminViewsAgencyComponent implements OnInit {

  constructor(private router : Router, private agencyService : AgencyService, private adminService : AdminService) { }

  ngOnInit(): void {
    this.getAgencyFromDatabase();
  }



  agency : Agency;
  agencyName : string;
  agencyStreetName : string;
  agencyStreetNumber : string;
  agencyCity : string;
  agencyState : string;
  agencyDescription : string;
  agencyPhone : string;
  agencyEmail : string;


  

  getAgencyFromDatabase(){

    let agencyUsername : string = localStorage.getItem('agencyUsernameForAdmin');

    this.agencyService.getAgencyWithUsername(agencyUsername).subscribe( (res : Agency) => {
      this.agency = res;


      // Dohvati radnike te agencije
      this.adminService.getAllWorkersForAgency(this.agency.username).subscribe( (allWorkers : Worker[]) => {
        this.allWorkersForAgency = allWorkers;
      });

      this.populateForm();
    });
  }


  populateForm(){
    this.agencyName = this.agency.agencyName;
    this.agencyStreetName = this.agency.streetAddress;
    this.agencyStreetNumber = this.agency.streetNumber;
    this.agencyCity = this.agency.city;
    this.agencyState = this.agency.state;
    this.agencyDescription = this.agency.description;
    this.agencyPhone = this.agency.phoneNumber;
    this.agencyEmail = this.agency.email;
  }


  getAgencyImage(){
    const backendUri = "http://localhost:4000";

    const pathBackslash = this.agency.imagePath;
    const imagePathForwardSlash = pathBackslash.replace(/\\/g, '/');    // Path is saved with backslash but I need to use forward slash, so replace them

    console.log(imagePathForwardSlash);                                 // Logging to check if path is good
   
    return `${backendUri}/${imagePathForwardSlash}`;                    // Return the path to the image for the logged user
  }



  updateAgencyInDB(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    const data = {
      username : this.agency.username,
      agencyName : this.agencyName,
      streetAddress : this.agencyStreetName,
      streetNumber : this.agencyStreetNumber,
      city : this.agencyCity,
      state : this.agencyState,
      description : this.agencyDescription,
      phoneNumber : this.agencyPhone,
      email : this.agencyEmail
    };

    if(this.agency.email == this.agencyEmail){
      // Email je ostao isti, samim tim nije promenjen, pa je tada zadovoljeno da je email jedinstven na nivou sistema

      this.adminService.updateAgencyWithUsername(data).subscribe( res => {
        if(res['message'] == 'agencyUpdated'){
          alert("Uspesno azurirana agencija!");
          
          this.ngOnInit();
        }
        else{
          console.log("Greska pri azuriranju agencije!")
        }
      });

    }
    else{
      // Uneti email je drugaciji od starog - mora se proveriti da li je taj novi email jedinstven
      this.adminService.verifyEmailUnique(this.agencyEmail).subscribe( response => {
        
        if(response['message'] == 'emailNotUnique'){
          alert("Greska! Email nije jedinstven!");
        }

        else if(response['message'] == 'emailUnique'){

          // Jeste jedinstven, moze da se odradi azuriranje

          this.adminService.updateAgencyWithUsername(data).subscribe( resDone => {
            if(resDone['message'] == 'agencyUpdated'){
              alert("Uspesno azurirana agencija!");
                    
              this.ngOnInit();
            }
            else{
              console.log("Greska pri azuriranju agencije!")
            }
          });

        }
      });
    }

    

  }


  deleteAgencyFromDB(){
    this.adminService.deleteAgencyWithUsername(this.agency.username).subscribe( res => {
      if(res['message'] == 'agencyDeleted'){
        alert("Agencija uspesno obrisana!");

        this.router.navigate(['admin']);
      }
      else{
        console.log("Greska pri brisanju agencije iz baze!");
      }
      
    });
  }


  // --------- Za dodavanje novog radnika ------------

  workerId : number;
  workerFirstname : string;
  workerLastname : string;
  workerEmail : string;
  workerPhone : string;
  workerExpertise : string;



  insertNewWorker(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    //alert("Prosla prijava");
    //return; // Dok ne istestiram validatore

    // Dohvatamo poslednji dodeljeni WorkerID, kako bismo novom radniku dodelili za 1 veci
    this.adminService.getLastWorkerId().subscribe( (res : IdTracking) => {
      let lastWorkerId = res.workerId;

      this.workerId = ++lastWorkerId;

      // Formiramo novi Worker objekat koji cemo dodati u bazu
      const worker = {
        workerId : this.workerId,
        worksFor : this.agency.username,
        firstname : this.workerFirstname,
        lastname : this.workerLastname,
        email : this.workerEmail,
        phoneNumber : this.workerPhone,
        expertise : this.workerExpertise
      }


      // Moramo da proverimo da li je email novog radnika jedistven u sistemu
      this.adminService.verifyEmailUnique(this.workerEmail).subscribe( response => {
        if(response['message'] == 'emailNotUnique'){
          alert("Greska! Email nije jedinstven!");
        }

        else if(response['message'] == 'emailUnique'){

          // Email jeste jedinstven i smemo da dodamo u bazu

          // Dodamo novog workera u bazu
          this.adminService.insertNewWorker(worker).subscribe( res => {
            if(res['message'] == 'error'){
              console.log("Greska pri dodavanju radnika u bazu podataka!");
            }
            else if(res['message'] == 'insertedWorker'){
              console.log("Radnik uspesno dodat u bazu podataka!");


              // U bazu unosimo workerId koji smo upravo dodelili poslednjem radniku
              this.adminService.insertNewWorkerId(this.workerId).subscribe( res => {
                if(res['message'] == 'updatedWorkerId'){
                  console.log("Uspesno azuriran workerId u bazi!");


                  // Dodatno, tog radnika moramo da evidentiramo i u toj konkretnoj agenciji, u nizu workersArray
                  this.adminService.insertWorkerToWorkersArray(this.agency.username, this.workerId).subscribe( res => {

                    if(res['message'] == 'workerInsertedToArray'){
                      alert("Uspesno dodat radnik!");

                      form.resetForm();
                      this.router.navigate(['/admin']);
                    }
                    else{
                      console.log("Greska pri dodavanju radnika u niz agencije!");
                    }

                    
                  });


                  
                }
                else{
                  console.log("Greska pri azuriranju workerId u bazi!");
                }
              });
            }
          });

        }
      });

    });
  }



  // -------------- Za rad sa radnicima ----------------

  allWorkersForAgency : Worker[] = [];

  goToWorkerPage(worker : Worker){
    localStorage.setItem('workerDetails', worker.workerId.toString());
    this.router.navigate(['workerDetailsPage']);
  }



  returnToAdminPage(){

    localStorage.removeItem('agencyUsernameForAdmin');
    this.router.navigate(['admin']);
  }
}
