import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Worker } from '../models/worker';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['./worker-details.component.css']
})
export class WorkerDetailsComponent implements OnInit {

  constructor(private router : Router, private adminService : AdminService) { }

  ngOnInit(): void {
    this.getDataForTheWorker();
  }


  specificWorker : Worker;
  workerPhoneNew : string;
  workerExpertiseNew : string;


  getDataForTheWorker(){

    let workerId = Number.parseInt(localStorage.getItem('workerDetails'));

    this.adminService.getWorkerWithThisId(workerId).subscribe( (worker : Worker) => {
      this.specificWorker = worker;

      this.workerPhoneNew = worker.phoneNumber;
      this.workerExpertiseNew = worker.expertise;
    });
  }


  editWorker(form : NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }


    this.adminService.updateWorkerWithId(this.specificWorker.workerId, this.workerPhoneNew, this.workerExpertiseNew).subscribe( res => {
      if(res['message'] == 'workerUpdated'){
        alert("Uspesno azuriran radnik!");

        this.ngOnInit();
      }
    });


  }



  deleteWorker(){

    // Prvo proveri da li je taj radnik trenutno zauzet na poslu - ne mozes da ga obrises iz agencije ako trenutno radi
    this.adminService.checkIfWorkerIsOnTheJob(this.specificWorker.workerId, this.specificWorker.worksFor).subscribe( res => {
      
      if(res['message'] == 'workerNotFound'){
        // To znaci da radnik nije u listi trenutno slobodnih radnika, sto znaci da trenutno radi, pa ne sme da se obrise
        alert("Radnik je trenutno aktivan na poslu i ne moze biti obrisan dok se posao ne zavrsi!");
        return;
      }

      else if(res['message'] == 'workerFound'){

        // Radnik je slobodan - moze se obrisati
        // Radnik se mora obrisati i iz kolekcije workers i iz spiska radnika koji su dodeljeni toj agenciji
        this.adminService.deleteWorkerFromCollection(this.specificWorker.workerId).subscribe( res => {
          if(res['message'] == 'deletedFromCollection'){

            console.log("Radnik uspesno obrisan iz kolekcije workers");


            // Obrisi iz agencije
            this.adminService.deleteWorkerFromAgency(this.specificWorker.workerId, this.specificWorker.worksFor).subscribe( response => {
              if(response['message'] == 'removedFromAgency'){

                alert("Uspesno uklonjen radnik!");

                this.router.navigate(['adminViewsAgencyDetails']);    // Predji na pregled agencije
              }
            });
          }
        });
      }

    });
  }




  returnToAdmin(){
    localStorage.removeItem('workerDetails');
    this.router.navigate(['adminViewsAgencyDetails']);    // Povratak na pregled agencije
  }
}
