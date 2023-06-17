import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
    // Ako user postoji tada pozovi logout
    // Ako user ne postoji tada navigiraj na home page

    let user = JSON.parse(localStorage.getItem('user'));

    if(user){
      this.logout();
    }
    else{
      this.router.navigate(['']);
    }
  }


  logout(){
    localStorage.clear();   // Clear user from localStorage
    location.reload();
    
  }

}
