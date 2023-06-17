import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let user : any = JSON.parse(localStorage.getItem('user'));
    if(user.type == "admin"){
      this.loggedAdmin = true;

      this.loggedClient = false;
      this.loggedAgency = false;
    }
    else if(user.type == "client"){
      this.loggedClient = true;

      this.loggedAgency = false;
      this.loggedAdmin = false;      
    }
    else if(user.type == "agency"){
      this.loggedAgency = true;

      this.loggedClient = false;
      this.loggedAdmin = false;
    }
  }


  loggedClient : boolean = false;
  loggedAgency : boolean = false;
  loggedAdmin : boolean = false;

  

}
