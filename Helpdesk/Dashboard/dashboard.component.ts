import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiSharedService } from '../../Services/APIHelper';
import { DataTableDirective } from 'angular-datatables';
import { DashBoardConstants } from '../Dashboard/dashboardConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  //@ViewChild(DataTableDirective)
  //dtElement: DataTableDirective;
  //dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject<any> = new Subject();
  popoverTitle = 'Here title';
  popoverMessage = 'Here description';
  cancelClicked = false;
  Result: any[] = [];
  tableWidget: any;
  registerForm: FormGroup;
  submitted = false;
  sample: Sample;
  constructor(private http: ApiSharedService, private constant: DashBoardConstants, private formBuilder: FormBuilder, private toast: ToastrService) {
    this.sample = <Sample>{};
    this.sample.GradeID = 0;
  }

  //page Load
  ngOnInit(): void {
    this.initload();
    this.getdetails();
  }
  // Form Initilization
  initload() {
    this.registerForm = this.formBuilder.group({
      GradeName: ['', Validators.required]
    });
  }
  //get details
  getdetails() {
    this.Result = [];
    this.http.GET(this.constant.get_dashboard).subscribe(
      (Result: any) => {
        this.Result = (Result);
      }
    );
  }
  //delete
  delete(GradeID: string) {
    this.http.GET(this.constant.delete_dashboard + GradeID).subscribe((Result: any) => {
    });
    this.getdetails();
  }

  //validation
  get f() { return this.registerForm.controls; }

  //form submitt 
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    var FormValues = this.registerForm.value;
    this.sample.GradeName = FormValues.GradeName;
    this.http.save(this.sample, this.constant.update_dashboard).subscribe((Result: any) => {
      console.log(Result);
    });
    this.onReset();
  }
  //edit
  Edit(re: any) {
    this.registerForm.controls.GradeName.setValue(re.GradeName);
    this.sample.GradeID = re.GradeID;
    //console.log(re);
  }
  onReset() {
    this.submitted = false
    this.registerForm.reset();
  }
}
export interface Sample {
  GradeName: string,
  GradeID: number
}
