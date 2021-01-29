import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalUtils } from '../../../Global/Globalvariables';
import { ApiSharedService } from '../../../Services/APIHelper';
import { UserProfile } from '../../../Global/UserProfile';
import { CasDetails } from '../../../Models/CAS/cas-details';
@Component({
  selector: 'app-Changeuser',
  templateUrl: './changeuser.html',
  styleUrls: []
})
export class ChangeUserComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  logindata: CasDetails;
  ticketEmployess: any[] = [];
  public get_TicketEmployeeDetails: string = 'api/Helpdesk/Process/ChangeUserEmployeeDetails';
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private global: GlobalUtils, private http: ApiSharedService, private User: UserProfile) {
    this.logindata = <CasDetails>{};
    this.logindata.EmployeeName = '';
  }
  ngOnInit() {
    // this.TicketEmployeeDetails();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }
  //TicketEmployeeDetails() {
  //  this.http.GET(this.get_TicketEmployeeDetails).subscribe(
  //    (Result: any) => {
  //      this.ticketEmployess = Result;
  //    }
  //  );
  //}
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.logindata.EmployeeCode = this.loginForm.value.username.toUpperCase();
    this.http.GET("ChangeUser" + "/" + this.logindata.EmployeeCode).subscribe(
      (Result: any) => {
        if (Result != null) {
          this.User.setProfile(Result);
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
          this.router.navigate(['/HelpDesk/Process/Registration']);

        }
      }
    );

  }

}
