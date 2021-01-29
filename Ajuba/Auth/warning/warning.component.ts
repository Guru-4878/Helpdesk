import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalUtils } from '../../../Global/Globalvariables';
import { ApiSharedService } from '../../../Services/APIHelper';
import { UserProfile } from '../../../Global/UserProfile';
import { CasDetails } from '../../../Models/CAS/cas-details';
import { Console } from 'console';
@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html'
})
export class WarningComponent implements AfterViewInit {
  loginUser: string;
  loginname: string;
  changeuser: string = "0"
  constructor(private router: Router, private route: ActivatedRoute, private global: GlobalUtils, private http: ApiSharedService, private User: UserProfile) {
    this.changeuser = localStorage.getItem("C");
  }
  ngAfterViewInit() {
    this.CAS_UserDetails();
  }
  CAS_UserDetails() {
    this.http.GET("AuthenticationDetails").subscribe(
      (Result: any) => {
        if (Result != null) {
          this.User.setProfile(Result);
          this.loginUser = this.User.getProfile().EmployeeCode;
          this.loginname = this.User.getProfile().EmployeeName;
          let profile: CasDetails = Result;
          console.log("Fir" + Result);
          sessionStorage.setItem('EmployeeCode', profile.EmployeeCode);
          sessionStorage.setItem('EmployeeName', profile.EmployeeName);
          sessionStorage.setItem('DeptCode', profile.DeptCode);
          sessionStorage.setItem('DeptName', profile.DeptName);
          sessionStorage.setItem('GradeID', profile.GradeID);
          sessionStorage.setItem('GradeName', profile.GradeName);
          sessionStorage.setItem('ProjectID', profile.ProjectID);
          sessionStorage.setItem('ProjectName', profile.ProjectName);
          sessionStorage.setItem('SecondaryProjects', profile.SecondaryProjects);
          this.http.GET("AuthenticationDetails").subscribe(
            (Result: any) => {
              if (Result != null) {
                console.log("Sec" + Result);
                this.User.setProfile(Result);
                this.loginUser = this.User.getProfile().EmployeeCode;
                this.loginname = this.User.getProfile().EmployeeName;
                let profile: CasDetails = Result;
                sessionStorage.setItem('EmployeeCode', profile.EmployeeCode);
                sessionStorage.setItem('EmployeeName', profile.EmployeeName);
                sessionStorage.setItem('DeptCode', profile.DeptCode);
                sessionStorage.setItem('DeptName', profile.DeptName);
                sessionStorage.setItem('GradeID', profile.GradeID);
                sessionStorage.setItem('GradeName', profile.GradeName);
                sessionStorage.setItem('ProjectID', profile.ProjectID);
                sessionStorage.setItem('ProjectName', profile.ProjectName);
                sessionStorage.setItem('SecondaryProjects', profile.SecondaryProjects);
                // console.log(Result);
                this.router.navigate(['/HelpDesk/Process/Registration']);
               
              }
            }
          );
        }
      }
    );

  }
  login() {
    this.router.navigate(['/HelpDesk/Process/Dashboard']);
  }
  logout() {
    this.router.navigate(['/auth/logout']);
  }
  // console.log(Result);
  //if (this.User.getProfile().EmployeeCode != null || this.User.getProfile().EmployeeCode != "") {
  //  this.User.setProfile(Result);
  //  console.log("1" + this.global.isAuthorized());
  //  console.log("1" + this.User.getProfile().EmployeeCode);
  //  this.CAS_UserDetails();
  //} else
  //  this.CAS_UserDetails();
  //if (this.global.isAuthorized() == false)
  //  this.router.navigate(['/auth/login']);
  //this.router.navigate(['/HelpDesk/Process/Dashboard']);
}
