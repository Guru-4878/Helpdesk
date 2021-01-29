import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiSharedService } from '../../../Services/APIHelper';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { Subject } from 'rxjs';
@Component({
  selector: 'app-sample',
  templateUrl: './sample.html'
})
export class SampleComponent implements OnInit {

  constructor(private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService) {

  }

  //page Load
  ngOnInit(): void {

  }
  isCollapsed: boolean = false;

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

}
