import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  uri = 'http://localhost:4000';

  
  verifyClient(usernameForm, emailForm){

    const data = {
      username : usernameForm,
      email : emailForm
    };

    return this.http.post(`${this.uri}/client/verifyClientUnique`, data);
  }

  verifyAgency(usernameForm, emailForm, agencyIdForm){

    const data = {
      username : usernameForm,
      email : emailForm,
      agencyId : agencyIdForm
    };

    return this.http.post(`${this.uri}/agency/verifyAgencyUnique`, data);
  }



  registerClient(formData){

    console.log("form data vrednosti iz servisa");
    for (const value of formData.values()) {
      console.log(value);
    }

    return this.http.post(`${this.uri}/client/registerClient`, formData);
  }

  registerAgency(formData){

    console.log("form data vrednosti iz servisa");
    for (const value of formData.values()) {
      console.log(value);
    }

    return this.http.post(`${this.uri}/agency/registerAgency`, formData);
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


  setRegStatusToAccepted(username, type){

    const data = {
      username : username,
      type : type
    };

    return this.http.post(`${this.uri}/admin/adminRegisteringUser`, data);
  }
}
