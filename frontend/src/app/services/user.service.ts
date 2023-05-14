import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';


  registerClient(firstnameForm, lastnameForm, usernameForm, passwordForm, phoneForm, emailForm){

    const data = {
      firstname : firstnameForm,
      lastname : lastnameForm,
      username : usernameForm,
      password : passwordForm,
      phoneNumber : phoneForm,
      email : emailForm
    }

    return this.http.post(`${this.uri}/client/registerClient`, data);
  }

  registerAgency(nameForm, streetForm, streetNumberForm, cityForm, stateForm, agencyIdForm, descForm, usernameForm, passwordForm, phoneForm, emailForm){

    const data = {
      agencyName : nameForm,
      streetAddress : streetForm,
      streetNumber : streetNumberForm,
      city : cityForm,
      state : stateForm,
      agencyId : agencyIdForm,
      desctiption : descForm,
      username : usernameForm,
      password : passwordForm,
      phoneNumber : phoneForm,
      email : emailForm
    }

    return this.http.post(`${this.uri}/agency/registerAgency`, data);
  }
}
