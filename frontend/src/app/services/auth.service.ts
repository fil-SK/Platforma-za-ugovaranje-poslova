import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor() { }

  canActivate() : boolean {
    
    let user : any = JSON.parse(localStorage.getItem('user'));

    if(user.type == "admin"){

    }
    else if(user.type == "client"){

    }
    else if(user.type == "agency"){

    }
    else{
      return false;
    }

    return true;
  }
}
