import { Component, OnInit } from '@angular/core';
import { Agency } from '../models/agency';
import { Client } from '../models/client';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService : AdminService) { }

  ngOnInit(): void {
    
    this.getAllClients();
    this.getAllAgencies();
    this.getPendingClients();
    this.getPendingAgencies();
  }


  allPendingClients : Client[];
  allPendingAgencies : Agency[];
  allClients : Client[];
  allAgencies : Agency[];


  getAllClients(){
    this.adminService.getAllClients().subscribe( (clientList : Client[]) => {
      this.allClients = clientList;
    });
  }

  getAllAgencies(){
    this.adminService.getAllAgencies().subscribe( (agenciesList : Agency[]) => {
      this.allAgencies = agenciesList;
    });
  }

  getPendingClients(){
    this.adminService.getPendingClients().subscribe( (pendingClientsList : Client[]) => {
      this.allPendingClients = pendingClientsList;
    } );
  }

  getPendingAgencies(){
    this.adminService.getPendingAgencies().subscribe( (pendingAgenciesList : Agency[]) => {
      this.allPendingAgencies = pendingAgenciesList;
    } );
  }
}
