import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { UserProfile } from '../../../Global/UserProfile';
import * as $ from "jquery";
import { GlobalUtils } from '../../../Global/Globalvariables';
import { ApiSharedService } from '../../../Services/APIHelper';
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {

  isLoading: boolean;
  LoginName: string;
  constructor(private router: Router, private user: UserProfile, private global: GlobalUtils, private http: ApiSharedService) {
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }
  ngOnInit(): void {
   // this.CAS_UserDetails();
    this.LoginName = this.user.getProfile().EmployeeName;
  }
  CAS_UserDetails() {
    this.http.GET("AuthenticationDetails").subscribe(
      (Result: any) => {
        if (Result != null) {
          this.user.setProfile(Result);
        }
      }
    );

  }
  ngAfterViewInit() {
    this.LoginName = this.user.getProfile().EmployeeName;
    if (this.user.getProfile().EmployeeName == null) {
      console.log(localStorage.getItem("EmployeeName"));
    }
  }

}
