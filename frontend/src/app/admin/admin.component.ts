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
  }


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
}
