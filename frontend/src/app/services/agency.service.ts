import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';


  changePassword(usernameLogged, newPassword){

    const data = {
      username : usernameLogged,
      password : newPassword
    };

    return this.http.post(`${this.uri}/agency/changePassword`, data);
  }


  getAgencyWithUsername(agencyUsername){
    const data = {
      username : agencyUsername
    };

    return this.http.post(`${this.uri}/agency/getAgencyWithUsername`, data);
  }


  getAllRequestsForThisAgency(agencyUsername){
    const data = {
      username : agencyUsername
    };

    return this.http.post(`${this.uri}/agency/getAllRequestsForThisAgency`, data);
  }


  acceptClientRequest(reqId, offer){

    const data = {
      requestId : reqId,
      agencyOffer : offer
    };

    return this.http.post(`${this.uri}/agency/acceptClientRequest`, data);
  }


  declineClientRequest(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/agency/declineClientRequest`, data)
  }


  getAllActiveJobs(agencyUsername){

    const data = {
      username : agencyUsername
    };

    return this.http.post(`${this.uri}/agency/getActiveJobsForAgency`, data);
  }


  changeRoomColor(roomId, roomColor){

    const data = {
      roomId : roomId,
      roomColor : roomColor
    };

    return this.http.post(`${this.uri}/agency/changeRoomColor`, data);
  }


  setAgencyDone(reqId){

    const data = {
      requestId : reqId
    };

    return this.http.post(`${this.uri}/agency/setAgencyDone`, data);
  }
}
