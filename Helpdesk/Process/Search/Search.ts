import { Component, OnInit, ViewChild, OnDestroy, HostListener, EmbeddedViewRef, ElementRef } from '@angular/core';
import { ApiSharedService } from '../../../Services/APIHelper';
import { formatDate } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { ValidatorFn, FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { SelectComponent, IOption } from 'ng-select';
import { map } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { UserProfile } from '../../../Global/UserProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalUtils } from '../../../Global/Globalvariables';
import { NgClass } from '@angular/common';
import { TicketSearch } from '../../../Models/Helpdesk/Process/TicketSearch';
import { IOptions } from '../../../Models/Helpdesk/Process/IOptions';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbDateParserFormatter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-Search',
  templateUrl: './Search.html',
  viewProviders: [NgClass],
  providers: [DatePipe]
})
export class SearchComponent implements OnInit {
  @ViewChild('date', { static: true }) d: NgbDatepicker;
  Empcode: string;
  DepCode: number = 0;
  Post_Details: string = 'api/Process/Search/Searchticketdetail';
  SingleSearch: FormGroup;
  SSubmitt = false
  AdvanceSearch: FormGroup;
  ASubmitt = false
  TCKT_Search: TicketSearch;
  TicketHistory: any[] = [];
  ResposibleDept: IOptions[] = [];
  TicketType: IOptions[] = [];
  Category: IOptions[] = [];
  SubCategory: IOptions[] = [];
  TicketPriority: IOptions[] = [];
  Status: IOptions[] = [];
  FromDept: string;
  AdvnaceDropdowns: any[] = [];
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

  constructor(private _Activatedroute: ActivatedRoute, private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService, private httpClient: HttpClient, private User: UserProfile, private Global: GlobalUtils, private router: Router) {
    this.Empcode = User.getProfile().EmployeeCode;
    this.DepCode = +User.getProfile().DeptCode;
    this.TCKT_Search = <TicketSearch>{};
    this.TCKT_Search.Empcode = this.Empcode;
    this.TCKT_Search.Depcode = this.DepCode;
  }
  ngOnInit() {
    this.Single_Oninit();
    this.Advance_Oninit();
    this.AdvanceSearchDropdowns();

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();
    let d: Date = new Date();
    let Cu = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    let Nt = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    this.AdvanceSearch.controls.FromDate.setValue(Cu);
    this.AdvanceSearch.controls.ToDate.setValue(Nt);
  }
  AdvanceSearchDropdowns() {
    this.http.GET(`api/Process/Search/AdvanceSearch/${this.Empcode}/${this.DepCode}`).subscribe((Result: any) => {
      this.AdvnaceDropdowns = Result["ViewCat"];
      this.ResposibleDept = this.uniqueBy(this.DynamicArrayCreatePush(Result["ViewCat"], "DepartmentID", "DepartmentName", "0"));
      this.TicketPriority = this.uniqueBy(this.DynamicArrayCreatePush(Result["ViewCat"], "PriorityID", "Priority", "0"));
      this.Status = this.DynamicArrayCreatePush(Result["Status"], "STATUS_ID", "STATUS_DESC", "0");
      this.FromDept = (this.ResposibleDept[0].label.toString());
    });
  }
  OnSelectedResponsible(option: IOptions) {

    let ResDeptId = this.AdvanceSearch.get("ResDeptId").value;
    let CatfilterResult: any = this.AdvnaceDropdowns.filter(u => u.DepartmentID == ResDeptId);
    this.TicketType = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "TicketTypeID", "TicketType", "0"));
  }
  OnSelectedTicketType(option: IOptions) {
    let ResDeptId = this.AdvanceSearch.get("ResDeptId").value;
    let CatfilterResult: any = this.AdvnaceDropdowns.filter(u => u.DepartmentID == ResDeptId && u.TicketTypeID == parseInt(option.value));
    this.Category = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "CategoryID", "Category", "0"));
  }
  OnSelectedCategory(option: IOptions) {
    let ResDeptId = this.AdvanceSearch.get("ResDeptId").value;
    let TicketTypeID = this.AdvanceSearch.get("TicketTypeId").value;
    let CatfilterResult: any = this.AdvnaceDropdowns.filter(u => u.DepartmentID == ResDeptId && u.TicketTypeID == TicketTypeID && u.CategoryID == parseInt(option.value));
    this.SubCategory = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "SubCategoryID", "SubCategory", "0"));
  }
  uniqueBy(arrobj) {
    let obj2 = {};
    const unique2 = (arr) => {
      let result = [];
      arr.forEach((item, i) => {
        obj2[item['label']] = i;
      });
      for (let key in obj2) {
        let index = obj2[key];
        result.push(arr[index])
      }
      return result;
    }
    return unique2(arrobj)
  }
  DynamicArrayCreatePush(arrobj, Title0, Title00, ParentId) {
    let result = [];
    const Title1 = Title0;
    const Title2 = Title00;
    arrobj.forEach((key) => {
      let opt = <IOptions>{};
      opt.value = key[Title1].toString();
      opt.label = key[Title2];
      if (ParentId != "0")
        opt.ParentId = key[ParentId].toString();
      result.push(opt);
    });
    return (result);
  }
  Single_Oninit() {
    this.SingleSearch = this.formBuilder.group({
      TicketId: ['', Validators.required]
    });
  }
  Advance_Oninit() {
    this.AdvanceSearch = this.formBuilder.group({
      ResDeptId: [''],
      TicketTypeId: [''],
      CategoryId: [''],
      SubCategoryId: [''],
      TicketPriorityId: [''],
      TicketStatus: [''],
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      CreatedBy: [''],
      TicketId: [''],
      SearchString: ['']
    });
  }
  AdvanceSubmit() {
    this.ASubmitt = true;
    if (this.AdvanceSearch.invalid)
      return

    this.TCKT_Search.Mode = 'A';
    this.TCKT_Search.Ticketid = this.AdvanceSearch.value.Ticketid == "" ? 0 : this.AdvanceSearch.value.Ticketid == undefined ? 0 : this.AdvanceSearch.value.Ticketid ;
    this.TCKT_Search.CategoryId = this.AdvanceSearch.value.CategoryId == "" ? 0 : this.AdvanceSearch.value.CategoryId ;
    this.TCKT_Search.SubCategoryId = this.AdvanceSearch.value.SubCategoryId == "" ? 0 : this.AdvanceSearch.value.SubCategoryId;
    this.TCKT_Search.ResDeptId = this.AdvanceSearch.value.ResDeptId == "" ? 0 : this.AdvanceSearch.value.ResDeptId;
    this.TCKT_Search.TicketTypeId = this.AdvanceSearch.value.TicketTypeId == undefined ? 0 : this.AdvanceSearch.value.TicketTypeId == "undefined" ? 0 : this.AdvanceSearch.value.TicketTypeId == "" ? 0 : this.AdvanceSearch.value.TicketTypeId;
    this.TCKT_Search.TicketPriorityId = this.AdvanceSearch.value.TicketPriorityId == "" ? 0 : this.AdvanceSearch.value.TicketPriorityId;
    this.TCKT_Search.CreatedBy = this.AdvanceSearch.value.CreatedBy;
    this.TCKT_Search.FromDate = this.dateToString(this.AdvanceSearch.value.FromDate);
    this.TCKT_Search.ToDate = this.dateToString(this.AdvanceSearch.value.ToDate);
    this.TCKT_Search.TicketStatus = this.AdvanceSearch.value.TicketStatus == "" ? 0 : this.AdvanceSearch.value.TicketStatus == null ? 0 : this.AdvanceSearch.value.TicketStatus;
    this.TCKT_Search.SearchString = this.AdvanceSearch.value.SearchString;
   // console.log(JSON.stringify(this.TCKT_Search));
    this.TicketHistoryDetails();
  }
  dateToString = (date) => `${isNumber(date.month) ? padNumber(date.month) : ''}/${isNumber(date.day) ? padNumber(date.day) : ''}/${date.year}`;
  ONReset() {
    this.ASubmitt = false;
    this.AdvanceSearch.reset();
  }
  onReset() {
    this.SSubmitt = false;
    this.SingleSearch.reset();
  }
  get S() { return this.SingleSearch.controls; }
  get A() { return this.AdvanceSearch.controls; }
  SingleSearchSubmitt() {
    this.SSubmitt = true;
    if (this.SingleSearch.invalid)
      return
    this.TCKT_Search.Mode = 'S';
    this.TCKT_Search.Ticketid = this.SingleSearch.value.TicketId;
    this.TicketHistoryDetails();
  }
  TicketHistoryDetails() {
    this.TicketHistory = [];
    this.http.post(this.TCKT_Search, this.Post_Details).subscribe((Result: any) => {
      this.TicketHistory = Result;
    });
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'SearchTickets.xlsx');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == "F9") {
      this.AdvanceSubmit();
    }
    if (event.key == "F8") {
      this.SingleSearchSubmitt();
    }
    if (event.key == "F2") {
      this.onReset();
    }
  }
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function hasClassName(element: any, className: string): boolean {
  return element && element.className && element.className.split &&
    element.className.split(/\s+/).indexOf(className) >= 0;
}

