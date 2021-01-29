import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ApiSharedService } from '../../../Services/APIHelper';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { Subject } from 'rxjs';
import { UserProfile } from '../../../Global/UserProfile';
import { GlobalUtils } from '../../../Global/Globalvariables';
@Component({
  selector: 'app-registrationdept',
  templateUrl: './RegistrationDept.html'
})
export class RegistrationDeptComponent implements OnInit {
  Result: any[] = [];
  
  Empcode: string = "";
  DepartmentId: number = 0;
  GradeId: number = 0;
  

  constructor(private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService, private User: UserProfile, private Global: GlobalUtils) {

    this.Empcode = this.User.getProfile().EmployeeCode;
    this.DepartmentId = +this.User.getProfile().DeptCode;
    this.GradeId = +this.User.getProfile().GradeID;
    
  }
  
  //page Load
  ngOnInit(): void {
    this.BindDashboard();
    console.log("Before view init page load");
  }

  BindDashboard() {
    this.Result = [];
    this.http.GET('api/Dashboard/getUserDepartments/' + this.Empcode + '/' + this.GradeId).subscribe(
      (Result: any) => {
        this.Result = (Result);
      }
    );
  }

}
