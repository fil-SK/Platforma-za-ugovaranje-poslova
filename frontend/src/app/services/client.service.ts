import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';


  changePassword(usernameLogged, newPassword){

    const data = {
      username : usernameLogged,
      password : newPassword
    };

    return this.http.post(`${this.uri}/client/changePassword`, data);
  }


  getLastRoomAndRealEstateId(){

    return this.http.get(`${this.uri}/client/getId`);
  }

  insertNewLastUsedRoomAndRealEstateId(updatedRoomId, updatedRealEstateId){

    const data = {
      roomId : updatedRoomId,
      realEstateId : updatedRealEstateId
    };

    return this.http.post(`${this.uri}/client/updateId`, data);
  }


  insertNewRealEstateToClient(clientUsername, realEstateId){

    const data = {
      clientUsername : clientUsername,
      realEstateId : realEstateId
    };

    return this.http.post(`${this.uri}/client/addNewRealEstate`, data);
  }


  insertRealEstateIntoCollection(newRealEstate){
    const data = {
      realEstate : newRealEstate
    };

    return this.http.post(`${this.uri}/realEstate/realEstateIntoCollection`, data);
  }
  

  uploadJSONSchema(formData){

    return this.http.post(`${this.uri}/client/uploadJSONSchema`, formData);

  }


  getAllRealEstatesForClient(clientUsername){

    const data = {
      username : clientUsername
    };

    return this.http.post(`${this.uri}/realEstate/getAllClientRealEstate`, data);
  }


  getAllAgencies(){
    return this.http.get(`${this.uri}/client/getAllAgencies`);
  }


  searchAgenciesByName(agName){

    const data = {
      agencyName : agName
    };

    return this.http.post(`${this.uri}/client/searchAgencyByName`, data);
  }


  searchAgencyByAddress(street, number){

    const data = {
      streetAddress : street,
      streetNumber : number
    };

    return this.http.post(`${this.uri}/client/searchAgencyByAddress`, data);
  }


  searchAgencyByNameAndAddress(name, street, number){

    const data = {
      agencyName : name,
      streetAddress : street,
      streetNumber : number
    };

    return this.http.post(`${this.uri}/client/searchAgencyByNameAndAddress`, data);
  }


  getLastRequestId(){
    return this.http.get(`${this.uri}/client/getLastRequestId`);
  }


  insertRequestIntoDatabase(data){

    return this.http.post(`${this.uri}/client/makeRequest`, data);
  }

  insertNewRequestIdIntoDatabase(id){

    const data = {
      requestId : id
    };

    return this.http.post(`${this.uri}/client/insertNewRequestId`, data);
  }


  markRealEstateForRenovation(id){
    
    const data = {
      realEstateId : id
    };

    return this.http.post(`${this.uri}/realEstate/markForRenovation`, data);
  }


  getAllClientRequests(username){
    
    const data = {
      clientUsername : username
    };

    return this.http.post(`${this.uri}/client/getAllRequestsForClient`, data);
  }


  getRealEstateForThisId(id){

    const data = {
      realEstateId : id
    };

    return this.http.post(`${this.uri}/realEstate/getRealEstateWithId`, data);
  }


  getClientWithThisUsername(clientUsername){

    const data = {
      username : clientUsername
    };

    return this.http.post(`${this.uri}/client/getClientWithThisUsername`, data);
  }


  getRequestWithThisId(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/client/getRequestWithId`, data);
  }


  acceptAgencyOffer(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/client/acceptOffer`, data);
  }


  rejectAgencyOffer(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/client/rejectOffer`, data);
  }


  markRequestAsCompleted(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/client/setRequestAsCompleted`, data);
  }


  insertReview(reqId, review){

    const data = {
      requestId : reqId,
      review : review
    };

    return this.http.post(`${this.uri}/client/insertReview`, data);
  }


  deleteReview(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/client/deleteReview`, data);
  }


  getAllClientUsernames(){
    return this.http.get(`${this.uri}/client/getAllClientUsernames`);
  }


  getAllClientFullNames(){
    return this.http.get(`${this.uri}/client/getAllClientsFullNames`);
  }
}
