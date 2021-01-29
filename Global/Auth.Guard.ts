
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GlobalUtils } from '../Global/Globalvariables';
@Injectable({
  providedIn: 'root'
})

export class Guards implements CanActivate {

  constructor(private router: Router, private global: GlobalUtils) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.global.isAuthorized() == false) {
      this.global.logout();
      window.location.href = this.global.RedirectLogin();
      return false;
    }
    return true;
  }
}
