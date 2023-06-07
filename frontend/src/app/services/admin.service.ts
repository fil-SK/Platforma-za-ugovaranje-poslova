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


  declineClientRegRequest(username){

    const data = {
      clientUsername : username
    };

    return this.http.post(`${this.uri}/admin/declineClient`, data);
  }


  acceptAgencyRegRequest(username){

    const data = {
      agencyUsername : username
    };

    return this.http.post(`${this.uri}/admin/acceptAgency`, data);
  }


  declineAgencyRegRequest(username){

    const data = {
      agencyUsername : username
    };

    return this.http.post(`${this.uri}/admin/declineAgency`, data);
  }


  getLastWorkerId(){
    return this.http.get(`${this.uri}/admin/getLastWorkerId`);
  }


  insertNewWorkerId(wId){
    const data = {
      workerId : wId
    };
    
    return this.http.post(`${this.uri}/admin/insertNewLastWorkerId`, data);
  }

  insertNewWorker(data){
    return this.http.post(`${this.uri}/admin/insertNewWorker`, data);
  }


  deleteClientWithUsername(clientUsername){

    const data = {
      username : clientUsername
    };

    return this.http.post(`${this.uri}/admin/deleteClient`, data);
  }


  updateClientWithUsername(clientUsername, clientFirstname, clientLastname, clientEmail, clientPhone){

    const data = {
      username : clientUsername,
      firstname : clientFirstname,
      lastname : clientLastname,
      email : clientEmail,
      phoneNumber : clientPhone
    };

    return this.http.post(`${this.uri}/admin/updateClientInDB`, data);
  }


  deleteAgencyWithUsername(agencyUsername){

    const data = {
      username : agencyUsername
    };

    return this.http.post(`${this.uri}/admin/deleteAgencyFromDB`, data);
  }


  updateAgencyWithUsername(data){

    return this.http.post(`${this.uri}/admin/updateAgencyFromDB`, data);
  }


  verifyEmailUnique(email){

    const data = {
      email : email
    };

    return this.http.post(`${this.uri}/admin/verifyEmailUnique`, data);
  }
}
