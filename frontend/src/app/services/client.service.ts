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
  /*insertRealEstate(newRealEstate){

    const data = {
      realEstate : newRealEstate
    };

    return this.http.post(`${this.uri}/client/insertRealEstate`, data);
  }
  */
}
