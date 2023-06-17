import { Component, OnInit } from '@angular/core';

// Ove dve linije dodajemo zato sto mi treba da pratim kada se promeni ruta, kako bi mogao da radim reinicijalizaciju navbara
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {


    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // Perform reinitialization logic for <app-navbar>
      
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
      else{
        this.loggedAdmin = false;
        this.loggedClient = false;
        this.loggedAgency = false;
      }

      //alert("REINICIJALIZOVAN NAVBAR");
    });

  }


  loggedClient : boolean = false;
  loggedAgency : boolean = false;
  loggedAdmin : boolean = false;

  

}
