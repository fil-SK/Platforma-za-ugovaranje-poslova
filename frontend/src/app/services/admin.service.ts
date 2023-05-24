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


  changePassword(usernameLogged, newPassword){
    const data = {
      username : usernameLogged,
      password : newPassword
    };

    return this.http.post(`${this.uri}/admin/changePassword`, data);
  }


  acceptClientRegRequest(username){
    
    const data = {
      clientUsername : username
    };

    return this.http.post(`${this.uri}/admin/acceptClient`, data);
  }

}
