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


  loginRegular(){
    // TODO

    // Ne znam kako da radim dalje, posto mi User nije jedan model, nego sam razdvojio klijente od agencija
    // U postavci je receno da se login radi samo preko username i password-a, a to mi je problem jer onda ne znam ka kojoj strani treba da uputim zahtev za dohvatanje korisnika
    // Imam dva vidjenja resenja sad:
    // 1. Da ubacim jedno radio dugme gde ce da odabere tip korisnika za koji se prijavljuje
    // 2. Da imam register metodu gde ce npr. prvo da pokusa da se uloguje kao korisnik, ako uspe onda top, ako ne uspe onda pokusa da se uloguje kao agencija, ako uspe top ako ne uspe
    // onda ne mozes vise nista tu i tad vrati gresku
    // Ovaj prvi msm da ne bih smeo da radim jer krsi postavku, a ovaj drugi mi deluje kao da brute force-ujem resenje, al ja nemam druge ideje za ovo
  }
}
