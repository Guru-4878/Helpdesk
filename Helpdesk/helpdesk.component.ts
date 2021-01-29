import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiSharedService } from '../Services/APIHelper';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { Subject } from 'rxjs';
@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html'
})
export class HelpdeskComponent implements OnInit {
  constructor(private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService) {

  }

  //page Load
  ngOnInit(): void {

  }

}
