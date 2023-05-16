import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';

  


  registerClient(formData){

    console.log("form data vrednosti iz servisa");
    for (const value of formData.values()) {
      console.log(value);
    }

    return this.http.post(`${this.uri}/client/registerClient`, formData);
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


  loginClient(usernameForm, passwordForm){
    
    const data = {
      username : usernameForm,
      password : passwordForm
    }

    return this.http.post(`${this.uri}/client/loginClient`, data);
  }


  loginAgency(usernameForm, passwordForm){
    
    const data = {
      username : usernameForm,
      password : passwordForm
    }

    return this.http.post(`${this.uri}/agency/loginAgency`, data);
  }

  
  loginAdmin(usernameForm, passwordForm){

    const data = {
      username : usernameForm,
      password : passwordForm
    }

    return this.http.post(`${this.uri}/client/loginAdmin`, data);
  }
}
