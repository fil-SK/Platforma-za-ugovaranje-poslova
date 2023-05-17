import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';


  getAllClients() {
    return this.http.get(`${this.uri}/admin/getAllClients`);
  }

  getAllAgencies(){
    return this.http.get(`${this.uri}/admin/getAllAgencies`);
  }

  getPendingClients(){
    return this.http.get(`${this.uri}/admin/getPendingClients`);
  }

  getPendingAgencies(){
    return this.http.get(`${this.uri}/admin/getPendingAgencies`);
  }

}
