import { Component, OnInit, ViewChild, OnDestroy, HostListener, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ApiSharedService } from '../../../Services/APIHelper';
import { formatDate } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { IOptions } from '../../../Models/Helpdesk/Process/IOptions';
import { TicketDetails_Models } from '../../../Models/Helpdesk/Process/TicketDetails_Model';
import { TicketHistory } from '../../../Models/Helpdesk/Process/TicketHistory_Model';
import { ValidatorFn, FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { SelectComponent, IOption } from 'ng-select';
import { map } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { UserProfile } from '../../../Global/UserProfile';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalUtils } from '../../../Global/Globalvariables';
import { NgClass } from '@angular/common';
import { TicketAdditionalDetailsComponent } from '../TicketAddtionalDetails/TicketAdditionalDetails';
import { TTRK_TCKT_Additional_Details } from '../../../Models/Helpdesk/Process/TTRK_TCKT_Additional_Details';
import { TTRK_KNOWLEDGE_BASE } from '../../../Models/Helpdesk/Process/TTRK_KNOWLEDGE_BASE';
import { TTRK_TPROCESS_DTLS } from '../../../Models/Helpdesk/Process/TTRK_TPROCESS_DTLS';
import { TTRK_TCKT_MST, TCKT_DETAILS_SAVE } from '../../../Models/Helpdesk/Process/TTRK_TCKT_MST';
import { Subject } from 'rxjs';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { FileHandle } from '../../../src/app/files-drag.directive';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-ticketdetails',
  templateUrl: './TicketDetails.html',
  viewProviders: [NgClass],
  providers: [DatePipe]
})
export class TicketDetailsComponent implements OnInit {
  /////////////////////   Started By AJP15179
  Fileerrors: Array<string> = [];
  @ViewChild(TicketAdditionalDetailsComponent) childTicketEvent;
  @ViewChild('template123') content;
  public get_Ticket_Dropdowns: string = 'api/Helpdesk/Process/TicketDropDownDetails/';
  public get_Ticket_History: string = 'api/Helpdesk/Process/TicketDetailsHistory/';
  public Post_TicketDetails: string = 'api/Helpdesk/Process/TicketDetailsSave';
  public Post_FilesUpload: string = 'api/Helpdesk/Process/TicketDetailsFilesupload/';
  public get_UploadedFiles: string = 'api/Helpdesk/Process/TicketUploadedFiles/';
  public get_TicketEmployeeDetails: string = 'api/Helpdesk/Process/TicketEmployeeDetails';
  public Post_TTRK_TicketDetailsSave: string = 'api/Helpdesk/Process/TTRK_TicketDetailsSave';
  public get_TicketsDepartments: string = 'api/Helpdesk/Process/TicketDepartments/';
  public get_SubDepartMents: string = 'api/Helpdesk/Process/SubDepartments/';
  public get_ITSubDepartMents: string = 'api/Helpdesk/Process/SubDepartmentsForIT/';
  public get_Status: string = 'api/Helpdesk/Process/Status';
  public get_ITDepartmentWiseLoadEmployess = 'api/Helpdesk/Process/TicketEmployeeDetailsITDepartMent';
  public Post_FinalReopen = 'api/Helpdesk/Process/TicketDetails_FinalClose_ReOpen';
  public chkValidTicket: string = 'api/Dashboard/CheckValidTicket/';
  parentMessage = "Ticket Details";
  ValidTicketDetails: any[] = [];
  bindticket: boolean = true;
  EmployeeVisile: boolean = false;
  DeptVisile: boolean = false;
  SubDeptVisile: boolean = false;
  ITticketEmployess: IOptions[] = [];
  ticketEmployess: IOptions[] = [];
  ClonedticketEmployess: IOptions[] = [];
  formData = new FormData();
  ResultDetails: any[] = [];
  ticketDepartment: IOptions[] = [];
  Dept_Mode: string = null;
  ticketStatus: IOptions[] = [];
  ticketStatus_Re_Open: IOption[] = [];
  ticketPriority: IOptions[] = [];
  ticketdetails: TicketDetails_Models;
  ticketCat: any[] = [];
  ticketSubcat: IOptions[] = [];
  ticketType: IOptions[] = [];
  ticketSubDepartMent: IOptions[] = [];
  ticketSubDepartMentsIT: IOptions[] = [];
  Details = [];
  DeatilsFilter_Object = [];
  ticket_desc: any = null;
  ticket_id: any = null;
  ticket_location: any = null;
  ticket_exnt: any = null;
  ticket_reg: any = null;
  ticket_type: any = null;
  DeptTypeID: any = null;
  Dept_Priorityid: any = null;
  DepartmentId = null;
  SubDepartment_Id = null;
  TicketTypeID = null;
  CategoryID = null;
  SubCategoryID = null;
  PriorityID = null;
  istickettype: boolean = false;
  isSubDeptIdIT: boolean = false;
  HRMS_DeptCode: any = 0;
  ticketHistoryDetails: TicketHistory[] = [];
  ticketid: number = 0;
  submitted = false;
  TicketDetailsForm: FormGroup;
  TicketDetailsReOpen_Form: FormGroup;
  submitted_Reopen = false;
  StatusDrop = false;
  buttontext = 'Re-Open/Final Close';
  Reopenticketdetails: TicketDetails_Models;
  allowedExtensions = [];
  ISystemFileS: Array<ISystemFile> = [];
  ticketfiles: Get_Files[] = [];
  ticketFilesreturn: Get_Files[] = [];
  HostUrl: string;
  popoverMessage: any = "";
   public mask = {
    guide: true,
    showMask: true,
    mask: [/\d/, /\d/, ":", /\d/, /\d/]
  };
  forms_hide_show = false;
  IsClose_FinalClose = false;
  IsClientSLA = false;
  TicketHistory: TicketHistory[] = [];
  DynamicStatus: boolean;
  Dynamicformarrya: any;
  ischildformcheck: boolean = false;
  TicketHistoryObj: any;
  TCKT_Additional_Details: TTRK_TCKT_Additional_Details;
  TCKT_KNOWLEDGE_BASE: TTRK_KNOWLEDGE_BASE;
  TCKT_TPROCESS_DTLS: TTRK_TPROCESS_DTLS;
  TTRK_TCKT_MST: TTRK_TCKT_MST;
  Tickt_DetailsFinalSave: TCKT_DETAILS_SAVE;
  minDate = undefined;
  fileExt: string = "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,txt";
  maxFiles: number = 3;
  maxSize: number = 5;//MB
  TicketMode: string;
  constructor(private disabledates: NgbDatepickerConfig, private modalService: NgbModal, private _Activatedroute: ActivatedRoute, private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService, private httpClient: HttpClient, private User: UserProfile, private Global: GlobalUtils, private router: Router) {
    this.HostUrl = this.Global.getBaseUrl();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    // disabledates.outsideDays = 'hidden';
    this.ticketid = + _Activatedroute.snapshot.paramMap.get("Ticketid");
    this.TicketMode = _Activatedroute.snapshot.paramMap.get("TicketMode");

    //this.ticketid = + this.Global.DecriptTicketId(_Activatedroute.snapshot.paramMap.get("Ticketid"));
    //this.TicketMode = this.Global.DecriptTicketId(_Activatedroute.snapshot.paramMap.get("TicketMode"));
    this.Reopenticketdetails = <TicketDetails_Models>{};
    this.Tickt_DetailsFinalSave = <TCKT_DETAILS_SAVE>{};
    this.TCKT_TPROCESS_DTLS = <TTRK_TPROCESS_DTLS>{
      CLIENT_SLA_DT: '', ADDNL_MAIL_ID: '', ALARM_DATE: '', AMOUNT_PAID: '', ASSIGNED_TO: '', BAYSOFT_UPDATED: '', FOL_UP_DATE: '', IsHide: '', STATUS_DESC: '',
      TCKT_ID: this.ticketid, TCKT_STATUS: '', TIME_TAKEN: '', TPROCESS_ID: 0, OLD_DEPT_TPRIORITY_ID: 0, PROCESS_COMMENTS: '', LICENCE_AVLBL: '',
      WAIT_MINS: '', WEIGHTAGE: '', UPDATED_BY: this.User.getProfile().EmployeeCode, Status_Id: 0
    };
    this.TTRK_TCKT_MST = <TTRK_TCKT_MST>{
      TCKT_DESC: '', TCKT_ID: this.ticketid, TCKT_Status: '', TPROCESS_ID: 0, DEPT_TPRIORITY_ID: 0, UPDATED_BY: this.User.getProfile().EmployeeCode,
      Status_Id: 0,
      CLIENT_SLA_DT: ''
    };
    this.ticketdetails = <TicketDetails_Models>{};
    this.ticketdetails.Status = '';
    this.ticketdetails.Comments = '';
    this.ticketdetails.RelatedTickets = '';
    this.ticketdetails.TimeTaken = '';
    this.ticketdetails.Physical_Table_Name = '';
    this.ticketdetails.TicketID = this.ticketid;
    this.ticketdetails.EmpCode = this.User.getProfile().EmployeeCode;
    this.ticketdetails.AssignedTO = '';
    this.ticketdetails.SubDeptId = '';
    this.TicketHistoryObj = <any>{};
    localStorage.removeItem("Copy");//Files Drag and Drop Here Copy Files Remove
  }
  ngOnInit(): void {    
    this.initload();
    this.CheckValidTicket();
    
    if (this.bindticket == true) {
      console.log("Vin" + this.bindticket);
      this.ticketHistoryfn();
      this.ticketdetailsDropdowns();
      //this.ticketStatusDrp();
      this.TicketEmployeeDetails();
      this.ttrk_tckt_Departments();
    }
    

  }
  //After Page Load We Are Calling Childmethod
  // Form Initilization
  initload() {
    this.allowedExtensions = ['csv'];
    this.TicketDetailsForm = this.formBuilder.group({
      Status: ['', Validators.required],
      Comments: ['', Validators.required],
      RelatedTickets: [''],
      TimeTaken: ['0000', Validators.required],
      Category: ['', Validators.required],
      SubCategory: ['', Validators.required],
      TicketPriority: ['', Validators.required],
      Files: ['', [FileValidator.fileMinSize(3072), FileValidator.fileExtensions(this.allowedExtensions)]],
      Employee: [''],
      DeptId: [''],
      SubDeptId: [''],
      TicketType: [''],
      SubDeptIdIT: [''],
      ClientSLA: ['']
    });

    this.TicketDetailsReOpen_Form = this.formBuilder.group({
      Status: ['', Validators.required],
      Comments: ['', Validators.required],
    });
  }
  //validation
  get t() { return this.TicketDetailsForm.controls; }
  get tt() { return this.TicketDetailsReOpen_Form.controls; }
  isChildFormValid(isvalid: any) {
    this.ischildformcheck = isvalid;

  }
  PassUnique_idChangedHandler(data: any) {

    this.ticketdetails.Physical_Table_Name = data.Physical_Table_Name;
  }
  //getdepartments
  ttrk_tckt_Departments() {
    this.http.GET(this.get_TicketsDepartments + this.Dept_Mode).subscribe((Result: any) => {
      this.ticketDepartment = Result;
    });
  }
  
  PriorityChanged(option: IOptions) {
    //Client SLA
    this.IsClientSLA = false;
    this.TicketDetailsForm.controls.ClientSLA.setValue('');
    this.TicketDetailsForm.controls.ClientSLA.clearValidators();
    this.TicketDetailsForm.controls.ClientSLA.updateValueAndValidity();
    if (option.value == "11") {
      this.IsClientSLA = true;
      this.ClientSLAValidation();
    }
    //END CLIENT SLA
  }
  ClientSLAValidation() {
    this.TicketDetailsForm.controls.ClientSLA.setValidators([Validators.required]);
    this.TicketDetailsForm.controls.ClientSLA.updateValueAndValidity();
  }
  StatusChanged(option: IOptions) {
    this.TicketDetailsForm.controls.DeptId.patchValue('');
    this.TicketHistoryObj.Status = option.value;
    if (this.childTicketEvent != undefined)
      this.childTicketEvent.ReinittheForm(option.value);

    this.DynamicStatus = false;
    if (option.value.toString() == "1".toString() || option.value.toString() == "2".toString()) {
      this.DynamicStatus = true
    }
    if (option.value.toString().trim() == "7".toString()) {
      this.TicketDetailsForm.controls.Employee.setValidators([Validators.required]);
      this.TicketDetailsForm.controls.Employee.updateValueAndValidity();
      this.EmployeeVisile = true;
      if (option.value.toString() == "7".toString() && this.DepartmentId != 12) {
        this.ticketEmployess = this.ticketEmployess.filter((R: any) => R.DeptCode == this.HRMS_DeptCode);
        //console.log(this.DepartmentId)
        if (this.DepartmentId == 1 || this.DepartmentId == 109) {
          this.ticketEmployess = [];
          let ticketEmployess = [...this.ClonedticketEmployess];
          this.ticketEmployess = ticketEmployess.filter((R: any) => R.DeptCode == this.HRMS_DeptCode && R.Parentid.toString() == "152");
        }
      } else {
        this.TicketEmployeeDetails();
      }
      // console.log(this.DepartmentId);
      if (this.DepartmentId == 12) {
        this.ticketEmployess = [];
        this.isSubDeptIdIT = true;
        this.TicketDetailsForm.controls.SubDeptIdIT.setValidators([Validators.required]);
        this.TicketDetailsForm.controls.SubDeptIdIT.updateValueAndValidity();
        this.http.GET(this.get_ITSubDepartMents + this.DepartmentId).subscribe((Result: any) => {
          if (Result != null) {
            this.ticketSubDepartMentsIT = Result;
          }
        });
      } else {
        this.isSubDeptIdIT = false;
        this.TicketDetailsForm.controls.SubDeptIdIT.clearValidators();
        this.TicketDetailsForm.controls.SubDeptIdIT.updateValueAndValidity();
      }
    } else {
      this.TicketDetailsForm.controls.Employee.clearValidators();
      this.TicketDetailsForm.controls.Employee.updateValueAndValidity();
      this.EmployeeVisile = false;
    }
    this.DeptVisile = false;
    // this.SubDeptVisile = false;
    if (option.value.toString() == "6".toString()) {
      this.DeptVisile = true;
      this.TicketDetailsForm.controls.DeptId.setValidators([Validators.required]);
      this.TicketDetailsForm.controls.DeptId.updateValueAndValidity();
    } else {
      this.TicketDetailsForm.controls.DeptId.clearValidators();
      this.TicketDetailsForm.controls.DeptId.updateValueAndValidity();
    }
  }
  LoadSubDepartMents(option: IOptions) {
    this.SubDeptVisile = false;
    this.TicketDetailsForm.controls.SubDeptId.clearValidators();
    this.TicketDetailsForm.controls.SubDeptId.updateValueAndValidity()
    if (option.value == "2") {
      this.http.GET(this.get_SubDepartMents + option.value).subscribe((Result: any) => {
        if (Result != null) {
          this.SubDeptVisile = true;
          this.TicketDetailsForm.controls.SubDeptId.setValidators([Validators.required]);
          this.TicketDetailsForm.controls.SubDeptId.updateValueAndValidity();
          this.ticketSubDepartMent = Result;
        }
      });
    }
  }
  LoadITSubDepartMents(option: IOptions) {
    let ticketEmployess: any = [...this.ClonedticketEmployess];
    this.ticketEmployess = ticketEmployess.filter((R: any) => R.Parentid.toString() == option.value.toString());

  }
  /**
   * Filters an array of objects (one level-depth) with multiple criteria.
   * @param  {Array}  array: the array to filter
   * @param  {Object} filters: an object with the filter criteria
   * @return {Array}
   */
  filterPlainArray(array, filters) {
    const getValue = value => (typeof value === 'string' ? value.toUpperCase() : value);
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores an empty filter
        if (!filters[key].length) return true;
        return filters[key].find(filter => getValue(filter) === getValue(item[key]));
      });
    });
  }
  ticketHistoryfn() {
    this.http.GET(this.get_Ticket_History + this.ticketid).subscribe(
      (Result: any) => {
        this.ticketHistoryDetails = Result["TicketData"];
        this.ticketfiles = Result["result"].filter((K: Get_Files) => K.Filename != "0");
        //if (Result["TicketData"][0].STATUS.trim().toString().toLowerCase() == "C".toLowerCase() && Result["TicketData"][0].RegisterUser.toLowerCase().toString() == this.User.getProfile().EmployeeCode.toString().toLowerCase())
        //  this.forms_hide_show = true;
        //if (Result["TicketData"][0].STATUS.trim().toString().toLowerCase() != "C".toLowerCase() && Result["TicketData"][0].RegisterUser.toLowerCase().toString() == this.User.getProfile().EmployeeCode.toString().toLowerCase()) {
        //  this.forms_hide_show = true;
        //  this.StatusDrop = true;
        //  this.buttontext = "Submit";
        //  this.TicketDetailsReOpen_Form.controls.Status.clearValidators();
        //  this.TicketDetailsReOpen_Form.controls.Status.updateValueAndValidity();
        //  this.Reopenticketdetails.Status = Result["TicketData"][0].STATUS.trim().toString();
        //}
        //if (Result["TicketData"][0].STATUS.trim().toString().toLowerCase() == "C".toLowerCase() || Result["TicketData"][0].STATUS.trim().toString().toLowerCase() == "FC".toLowerCase()) {
        //  this.forms_hide_show = true;
        //  this.IsClose_FinalClose = true;
        //}
      });
  }
  DependentFilter(selectValues, value) {
    const select = selectValues.find(_ => _.value == value);
    return select ? select.value : select;
  }
  ticketdetailsDropdowns() {
    this.http.GET(this.get_Ticket_Dropdowns + this.ticketid + "/" + this.User.getProfile().EmployeeCode).subscribe(
      (Result: any) => {
        this.Details = Result["ticketIds"];      
        this.Details.forEach((k) => {
          this.DepartmentId = k.DepartmentId;
          this.SubDepartment_Id = k.SubDepartment_Id;
          this.TicketTypeID = k.TicketTypeID;
          this.ticket_type = k.TicketType;
          this.ticket_desc = k.TCKT_DESC;
          this.ticket_id = k.TCKT_ID;
          this.ticket_exnt = k.EXTENSION_NO;
          this.ticket_reg = k.UPDATED_DT;
          this.ticket_location = k.LOCATION;
          this.HRMS_DeptCode = k.HRMS_DeptCode;
          this.DeptTypeID = k.DeptTypeID;
          this.Dept_Priorityid = k.Dept_Priorityid;
          this.CategoryID = k.CategoryID;
          this.SubCategoryID = k.SubCategoryID;
          this.PriorityID = k.PriorityID;         
          if (k.PriorityID.toString() == "11") {
            this.IsClientSLA = true;
            if (k.CLIENT_SLA_DT != null) {
              const SLAConvertTODate = new Date(k.CLIENT_SLA_DT);
              let SLADATE = { year: SLAConvertTODate.getFullYear(), month: SLAConvertTODate.getMonth() + 1, day: SLAConvertTODate.getDate() };
              this.TicketDetailsForm.controls.ClientSLA.setValue(SLADATE);
            }
            this.ClientSLAValidation();
          }

          this.TicketHistoryObj.Status = '';
          this.TicketHistoryObj.Tickeft_type = this.ticket_type;
          this.TicketHistoryObj.TicketTypeID = this.TicketTypeID;
          this.TicketHistoryObj.Dept_Priorityid = k.Dept_Priorityid;
          this.TicketHistoryObj.ScreenName = "2";
          this.TicketHistoryObj.DeptTypeID = k.DeptTypeID;
          this.TicketHistoryObj.Ticketid = this.ticketid;

         // this.ticketStatusDrp();
          //Page Load We Are Calling Additional Fileds Plugin  ///Its An Mandatory to call here 
          this.childTicketEvent.ReinittheForm("0");
        });
        this.ticketStatus = this.uniqueBy(Result["Status"]);
        const filters = {
          value: ['8', '2']
        };
        this.ticketStatus_Re_Open = this.filterPlainArray(Result["Status"], filters);;

        this.ResultDetails = Result["MasterDropDowns"];
        const key = 'value';
        let ticketCat: any[] = [];
        Result["MasterDropDowns"].forEach((c) => {
          let P = <IOptions>{};
          P.label = c.Category.toString();
          P.value = c.CategoryID.toString();
          ticketCat.push(P);
        });
        let ticketCatobj: IOptions[] = [];
        ticketCatobj = [...this.uniqueBy(ticketCat)];
        ticketCatobj = this.SortByAscending(ticketCatobj);
        this.ticketCat = ticketCatobj;
        let CatfilterResult: any = Result["MasterDropDowns"].filter(u =>
          u.TicketTypeID == this.TicketTypeID && u.CategoryID == this.CategoryID && u.DepartmentID == +this.DepartmentId && u.SubDepartment_Id == this.SubDepartment_Id);
        CatfilterResult.forEach((c) => {
          let P = <IOptions>{};
          P.label = c.SubCategory.toString();
          P.value = c.SubCategoryID.toString();
          this.ticketSubcat.push(P);
        });
        let ticketSubcat = this.uniqueBy(this.ticketSubcat);
        this.ticketSubcat = [];
        this.ticketSubcat = this.SortByAscending(ticketSubcat);
        let PriorityfilterResult: any = Result["MasterDropDowns"].filter(u =>
          u.TicketTypeID == this.TicketTypeID && u.CategoryID == this.CategoryID && u.DepartmentID == +this.DepartmentId &&
          u.SubDepartment_Id == this.SubDepartment_Id && u.SubCategoryID == this.SubCategoryID);
        PriorityfilterResult.forEach((c) => {
          let P = <IOptions>{};
          P.label = c.Priority.toString();
          P.value = c.PriorityID.toString();
          this.ticketPriority.push(P);
        });
        let ticketPriority = this.uniqueBy(this.ticketPriority);
        this.ticketPriority = [];
        this.ticketPriority = this.SortByAscending(ticketPriority);
        Result["MasterDropDowns"].forEach((c) => {
          let P = <IOptions>{};
          P.label = c.TicketType.toString();
          P.value = c.TicketTypeID.toString();
          this.ticketType.push(P);
        });
        this.ticketType = this.uniqueBy(this.ticketType);
        if (this.ticket_type == "Re-Assign")
          this.istickettype = true;
        else
          this.istickettype = false;

        /// Two Binding Values
        this.ticketdetails.DeptTypeID = this.DeptTypeID;
        this.ticketdetails.Dept_Priorityid = this.Dept_Priorityid;
        this.ticketdetails.TicketType = this.TicketTypeID;
        this.ticketdetails.Category = this.CategoryID.toString();
        this.ticketdetails.SubCategory = this.SubCategoryID.toString();
        this.ticketdetails.TicketPriority = this.PriorityID.toString();
        this.TicketDetailsForm.controls.TicketType.setValue(this.TicketTypeID.toString());
        this.TicketDetailsForm.controls.Category.setValue(this.CategoryID.toString());
        this.TicketDetailsForm.controls.SubCategory.setValue(this.SubCategoryID.toString());
        this.TicketDetailsForm.controls.TicketPriority.setValue(this.PriorityID.toString());
        // Logic For Hide And Show Forms
        if (Result["ticketIds"][0].STATUS.trim().toString().toLowerCase() == "C".toLowerCase() &&
              Result["ticketIds"][0].RegisterUser.toLowerCase().toString() == this.User.getProfile().EmployeeCode.toString().toLowerCase())
          this.forms_hide_show = true;
        if (Result["ticketIds"][0].STATUS.trim().toString().toLowerCase() != "C".toLowerCase()
          && Result["ticketIds"][0].RegisterUser.toLowerCase().toString() == this.User.getProfile().EmployeeCode.toString().toLowerCase()) {
          console.log(Result["ticketIds"]); 
          if (Result["ticketIds"][0].HRMS_DeptCode != this.User.getProfile().DeptCode) {
            console.log("add");
            this.forms_hide_show = true;
            this.StatusDrop = true;
            this.buttontext = "Submit";
            this.TicketDetailsReOpen_Form.controls.Status.clearValidators();
            this.TicketDetailsReOpen_Form.controls.Status.updateValueAndValidity();
            this.Reopenticketdetails.Status = Result["ticketIds"][0].STATUS.trim().toString();
          }
        }

        if (Result["ticketIds"][0].STATUS.trim().toString().toLowerCase() == "C".toLowerCase() || Result["ticketIds"][0].STATUS.trim().toString().toLowerCase() == "FC".toLowerCase()) {
          this.forms_hide_show = true;
          this.IsClose_FinalClose = true;
        }


        if (Result["ticketIds"][0].Dynamic_Workflow.toString().toLowerCase() == "true" && Result["ticketIds"][0].STATUS.trim().toString().toLowerCase() != "C".toLowerCase()
          && Result["ticketIds"][0].RegisterUser.toLowerCase().toString() != this.User.getProfile().EmployeeCode.toString().toLowerCase()) {

          if (this.TicketMode.toUpperCase() == "RW") {
            this.forms_hide_show = false;
            this.IsClose_FinalClose = false;
          }
          else {
            console.log("DY2");
            this.forms_hide_show = true;
            this.IsClose_FinalClose = true;
          }
        }
        //END//
      }
    );
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
  SortByAscending(arrobj) {
    return arrobj.sort((a, b) => (a.label < b.label ? -1 : 1));
  }
  SortByDescending(arrobj) {
    return arrobj.sort((a, b) => (a.label > b.label ? -1 : 1));
  }
  convertMinutesToDays(time) {
    let hours
    let days
    let restMinutes
    const onedayMinutes = 1440 //24*60
    let minutes = time * 60;
    if (minutes < 60) {
      return `${0} Days ${0} Hours ${minutes} Minutes`
    } else if (minutes > 60 && minutes < onedayMinutes) {
      hours = Math.floor(minutes / 60)
      restMinutes = minutes % 60
      return `${0} Days ${hours} Hours ${restMinutes} Minutes`
    } else {
      days = Math.floor((minutes / 60) / 24)
      restMinutes = minutes % onedayMinutes
      hours = Math.floor(restMinutes / 60)
      restMinutes = restMinutes % 60
      return `${days} Days ${hours} Hours ${restMinutes} Minutes`
    }
  }
  TimetakenCalculation(datetimes, i) {
    let Currentdateime;
    let Beforedatetime;
    if (i == 0)
      Currentdateime = new Date(datetimes);
    else
      Beforedatetime = new Date(datetimes);
  
  }
  OnSelectedTicketType(option: IOptions) {

    this.TicketDetailsForm.controls.Category.setValue('');
    this.TicketTypeID == option.value;
    let CatfilterResult: any = this.ResultDetails.filter(u =>
      u.TicketTypeID == option.value);
    let ticketCat: any[] = [];
    CatfilterResult.forEach((c) => {
      let P = <IOptions>{};
      P.label = c.Category.toString();
      P.value = c.CategoryID.toString();
      ticketCat.push(P);
    });
    let ticketCatobj: IOptions[] = [];
    ticketCatobj = [...this.uniqueBy(ticketCat)];
    this.ticketCat = ticketCatobj;

  }
  OnSelectedCategory(option: IOptions) {
    this.TicketTypeID = this.TicketDetailsForm.get("TicketType").value;
    // && u.TicketTypeID == this.TicketTypeID && u.DepartmentID == +this.DepartmentId && u.SubDepartment_Id == this.SubDepartment_Id
    this.CategoryID = option.value;
    this.ticketSubcat = [];
    let CatfilterResult: any = this.ResultDetails.filter(u =>
      u.CategoryID == option.value && u.TicketTypeID == this.TicketTypeID);
    //console.log(CatfilterResult);
    CatfilterResult.forEach((c) => {
      let P = <IOptions>{};
      P.label = c.SubCategory.toString();
      P.value = c.SubCategoryID.toString();
      this.ticketSubcat.push(P);
    });
    let ticketSubcat = this.uniqueBy(this.ticketSubcat);
    this.ticketSubcat = [];
    this.ticketSubcat = ticketSubcat;
    this.ticketdetails.SubCategory = ''
    this.TicketDetailsForm.controls.SubCategory.setValue('');
  }
  OnSelectedSubCategory(option: IOptions) {
    this.TicketDetailsForm.controls.TicketPriority.setValue('');
    //u.CategoryID == this.CategoryID && u.TicketTypeID == this.TicketTypeID && u.DepartmentID == +this.DepartmentId &&
    // u.SubDepartment_Id == this.SubDepartment_Id && u.SubCategoryID == option.value
    this.TicketTypeID = this.TicketDetailsForm.get("TicketType").value;
    this.ticketPriority = [];
    let PriorityfilterResult: any = this.ResultDetails.filter(u =>
      u.CategoryID == this.CategoryID && u.SubCategoryID == option.value && u.TicketTypeID == this.TicketTypeID);
    //console.log(PriorityfilterResult);
    PriorityfilterResult.forEach((c) => {
      let P = <IOptions>{};
      P.label = c.Priority.toString();
      P.value = c.PriorityID.toString();
      this.ticketPriority.push(P);
    });
    let ticketPriority = this.uniqueBy(this.ticketPriority);
    this.ticketPriority = [];
    this.ticketPriority = ticketPriority;
    this.ticketdetails.TicketPriority = ''
    this.TicketDetailsForm.controls.TicketPriority.setValue('');
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == "F9") {
      this.ticketFormSubmitt();
    }
    if (event.key == "F2") {
      this.onReset();
    }
  }
  Re_Open_ticketFormSubmitt() {
    this.submitted_Reopen = true;

    if (this.TicketDetailsReOpen_Form.invalid)
      return
    this.Reopenticketdetails.AssignedTO = '';
    this.Reopenticketdetails.Category = '';
    this.Reopenticketdetails.DeptId = '';
    this.Reopenticketdetails.Dept_Priorityid = 0;
    this.Reopenticketdetails.EmpCode = this.User.getProfile().EmployeeCode;
    this.Reopenticketdetails.ExtensionNo = '';
    this.Reopenticketdetails.FilesUpload = null;
    this.Reopenticketdetails.Location = null;
    this.Reopenticketdetails.Physical_Table_Name = null;
    this.Reopenticketdetails.RegisteredDt = null;
    this.Reopenticketdetails.RelatedTickets = null;
    this.Reopenticketdetails.Category = null;
    this.Reopenticketdetails.SubCategory = null;
    this.Reopenticketdetails.SubDeptId = null;
    this.Reopenticketdetails.TicketType = null;
    this.Reopenticketdetails.TimeTaken = null;
    this.Reopenticketdetails.TicketPriority = null;
    this.Reopenticketdetails.TicketID = this.ticket_id;
    if (this.StatusDrop == false)
      this.Reopenticketdetails.Status = this.TicketDetailsReOpen_Form.value.Status == "8" ? "5" : this.TicketDetailsReOpen_Form.value.Status;
    else
      this.Reopenticketdetails.Status = '5';

    this.Reopenticketdetails.Comments = this.TicketDetailsReOpen_Form.value.Comments;
    this.http.save(this.Reopenticketdetails, this.Post_FinalReopen).subscribe((Result: any) => {
      console.log(Result.Msg);
      this.router.navigate(['/HelpDesk/Process/Dashboard']);
    });
  }
  IsCheckFiles() {
    this.Fileerrors = [];
    this.isValidFiles(this.ISystemFileS);
  }
  
  ticketFormSubmitt() {
    this.submitted = true;
    if (this.TicketDetailsForm.invalid)
      return

    this.Fileerrors = [];

    // Validate file size and allowed extensions Added 12/21/2020
    if (this.ISystemFileS.length > 0 && (!this.isValidFiles(this.ISystemFileS)))
      return;

    for (const field in this.TicketDetailsForm.controls) {
      switch (field) {
        case "Comments":
          this.TCKT_TPROCESS_DTLS.PROCESS_COMMENTS = this.TicketDetailsForm.controls[field].value;
          break;
        case "Status":
          this.TCKT_TPROCESS_DTLS.TCKT_STATUS = this.TicketDetailsForm.controls[field].value;
          this.TTRK_TCKT_MST.TCKT_Status = this.TicketDetailsForm.controls[field].value;
          this.TTRK_TCKT_MST.Status_Id = this.TicketDetailsForm.controls[field].value;
          this.TCKT_TPROCESS_DTLS.Status_Id = this.TicketDetailsForm.controls[field].value;
          break;
        case "TimeTaken":
          this.TCKT_TPROCESS_DTLS.TIME_TAKEN = this.TicketDetailsForm.controls[field].value.replace('_', '0').replace(':', '.').replace('_0', '0').replace('0_', '0').replace('__', '0');
          break;
        case "Employee":
          this.TCKT_TPROCESS_DTLS.ASSIGNED_TO = this.TicketDetailsForm.controls[field].value;
          break;
        case "TicketType":
          this.ticketdetails.TicketType = this.TicketDetailsForm.controls[field].value;
          break;
        case "Category":
          this.ticketdetails.Category = this.TicketDetailsForm.controls[field].value;
          break;
        case "SubCategory":
          this.ticketdetails.SubCategory = this.TicketDetailsForm.controls[field].value;
          break;
        case "DeptId":
          this.ticketdetails.DeptId = this.TicketDetailsForm.controls[field].value;
          break;
        case "SubDeptId":
          this.ticketdetails.SubDeptId = this.TicketDetailsForm.controls[field].value;
          break;
        case "TicketPriority":
          this.ticketdetails.TicketPriority = this.TicketDetailsForm.controls[field].value;
          break;
        case "ClientSLA":
          if (this.TicketDetailsForm.controls[field].value != "//undefined") {
            this.ticketdetails.ClientSLA = this.dateToString(this.TicketDetailsForm.controls[field].value);
          }
          break;
      }
    }
    this.Tickt_DetailsFinalSave.TTRK_TCKT_MST = this.TTRK_TCKT_MST;
    this.Tickt_DetailsFinalSave.TTRK_TPROCESS_DTLS = this.TCKT_TPROCESS_DTLS;
    this.Tickt_DetailsFinalSave.TicketDetails_Models = this.ticketdetails;

    //SaveChildFormData
    this.childTicketEvent.SubmittChildForm();

    const formData = new FormData();
    this.ISystemFileS.forEach(K => {
      formData.append(K.fileName, K.file);
    });
    this.http.save(this.Tickt_DetailsFinalSave, this.Post_TTRK_TicketDetailsSave).subscribe((Result: any) => {
      if (this.ISystemFileS.length > 0) {
        this.httpClient.request(new HttpRequest('POST',
          this.Post_FilesUpload + this.ticketid + "/" + Result.TPROCESS_ID,
          formData)).subscribe((Result: any) => {
            console.log(Result)
          });
      }
      this.MsgShow(Result.Msg);
      this.ISystemFileS = [];
      //Remove Already object Array Freshly added  the Object
      this.ticketHistoryDetails = [];
      this.ticketHistoryfn();
      this.router.navigate(['/HelpDesk/Process/Dashboard']);
    });
  }
  isValidFiles(files) {
    // Check Number of files
    if (files.length > this.maxFiles) {
      this.Fileerrors.push("Error: At a time you can upload only " + this.maxFiles + " files");
      return;
    }
    this.isValidFileExtension(files);
    return this.Fileerrors.length === 0;
  }
   isValidFileExtension(files) {
    // Make array of file extensions
    var extensions = (this.fileExt.split(','))
      .map(function (x) { return x.toLocaleUpperCase().trim() });

    for (var i = 0; i < files.length; i++) {
      // Get file extension
      var ext = files[i].fileName.toUpperCase().split('.').pop() || files[i].fileName;
      // Check the extension exists
      var exists = extensions.includes(ext);
      if (!exists) {
        this.Fileerrors.push("Error (Extension): " + files[i].fileName);
      }
      // Check file size
      this.isValidFileSize(files[i]);
    }
  }
  isValidFileSize(file) {
    var fileSizeinMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeinMB * 100) / 100; 
    if (size > this.maxSize)
      this.Fileerrors.push("Error (File Size): " + file.fileName + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
  }

  dateToString = (date) => `${isNumber(date.day) ? padNumber(date.day) : ''}/${isNumber(date.month) ? padNumber(date.month) : ''}/${date.year}`;
  onReset() {
    this.submitted = false;
    this.TicketDetailsForm.reset();
  }
  upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.split('.').pop();      
      this.ISystemFileS.push({ fileName: file.name, Type: ext, Size: this.formatBytes(file.size), file: file, css: ext });
      this.IsCheckFiles();
    }
  }
  //get_NgClassStatus(ext) {
  // // switch (ext) {
  //    //case "doc": return "fileuploader-item file-type-no file-ext-doc file-has-popup upload-failed";
  //    //case "docx": return "fileuploader-item file-type-no file-ext-docx file-has-popup upload-failed";
  //    //case "css": return "fileuploader-item file-type-no file-ext-css file-has-popup upload-failed";
  //    //case "html": return "fileuploader-item file-type-no file-ext-html file-has-popup upload-failed";
  //    //case "pdf": return "fileuploader-item file-type-no file-ext-pdf file-has-popup upload-failed";
  //    //case "pps": return "fileuploader-item file-type-no file-ext-pps file-has-popup upload-failed";
  //    //case "ppsx": return "fileuploader-item file-type-no file-ext-ppsx file-has-popup upload-failed";
  //    //case "ppt": return "fileuploader-item file-type-no file-ext-ppt file-has-popup upload-failed";
  //    //case "pptx": return "fileuploader-item file-type-no file-ext-pptx file-has-popup upload-failed";
  //    //case "psd": return "fileuploader-item file-type-no file-ext-psd file-has-popup upload-failed";
  //    //case "rar": return "fileuploader-item file-type-no file-ext-rar file-has-popup upload-failed";
  //    //case "txt": return "fileuploader-item file-type-no file-ext-txt file-has-popup upload-failed";
  //    //case "xls": return "fileuploader-item file-type-no file-ext-xls file-has-popup upload-failed";
  //    //case "xlsx": return "fileuploader-item file-type-no file-ext-xlsx file-has-popup upload-failed";
  //    //case "png": return "fileuploader-item file-type-no file-ext-png file-has-popup upload-failed";
  //    //case "jpg": return "fileuploader-item file-type-no file-ext-jpg file-has-popup upload-failed";
  //    //case "jpeg": return "fileuploader-item file-type-no file-ext-jpeg file-has-popup upload-failed";
  //    //default:
  //  return "fileuploader-item file-type-no file-ext-" + ext + " file-has-popup upload-failed";
  //  //}
  //}
  filesDropped(files: FileHandle[]) {
    this.ISystemFileS = files;
  }
  TprocessDownloadFile(Filepath, Shortname) {
    let path = Filepath.split('wwwroot')[1];
    let Rootpath = path;

    this.http.downloadFile(Rootpath, Shortname);
  }
  handleFileInput(event) {
    for (let file of event) {
      this.ISystemFileS.push({ fileName: file.name, Type: file.type, Size: this.formatBytes(file.size), file: event});
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteItem(message: any) {
    this.ISystemFileS = this.ISystemFileS.filter(({ fileName }) => fileName !== message);
    //Drag and Drop Copy Files Remove
    if (JSON.parse(localStorage.getItem("Copy")) != null) {
      let Copyarray: any = JSON.parse(localStorage.getItem("Copy")).filter(({ fileName }) => fileName !== message);
      localStorage.removeItem("Copy");
      localStorage.setItem("Copy", JSON.stringify(Copyarray));
    }
    //Ended
    this.IsCheckFiles();
  }
  MsgShow(msg: any) {
    this.toast.success(msg);
  }
  TicketEmployeeDetails() {
    this.http.GET(this.get_TicketEmployeeDetails).subscribe(
      (Result: any) => {
        this.ticketEmployess = Result;
        this.ClonedticketEmployess = [...this.ticketEmployess];
      }
    );
  }

  CheckValidTicket() {
      this.ValidTicketDetails = [];

      this.http.GET(this.chkValidTicket + this.ticketid + "/" + this.User.getProfile().EmployeeCode + "/" + this.User.getProfile().DeptCode).subscribe(
        (Result: any) => {
            
          //this.ValidTicketDetails = Result["rFinalTckts"];
          this.ValidTicketDetails = Result;
          
          if (this.ValidTicketDetails.length == 0) {
            this.bindticket = false;
            
            this.popoverMessage = "You do not have access to view ticket";
            this.openModal();
          }
          else {
            
            const Mode: string = Result[0].Mode;
           
            if (Mode.toUpperCase() != this.TicketMode.toUpperCase()) {
              this.popoverMessage = "You do not have access to view ticket";
              this.openModal();
            }
          }

        }
      );

  }

  UnAuthAccess() {
    this.modalService.dismissAll();
    this.router.navigate(['/HelpDesk/Process/Dashboard']);
  }
  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'sm'
    };
    this.modalService.open(this.content, ngbModalOptions);
  }


  classOf<T>(o: T): any {
    return o.constructor;
  }
}
export interface Get_Files {
  Shortname: string;
  TicketId: number;
  TProcessId: number;
  Filename: string;
}
export interface FileSaveDetails {

  ISystemFile: ISystemFile[];
}

export interface ISystemFile {
  fileName: string;
  Type: string;
  Size: string;
  file: File;
  css?: string;
  isdelete?: string;
}

export class FileValidator {

  static fileMaxSize(maxSize: number): ValidatorFn {
    const validatorFn = (file: File) => {
      if (file instanceof File && file.size > maxSize) {
        return { fileMinSize: { requiredSize: maxSize, actualSize: file.size, file } };
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  static fileMinSize(minSize: number): ValidatorFn {
    const validatorFn = (file: File) => {
      if (file instanceof File && file.size < minSize) {
        return { fileMinSize: { requiredSize: minSize, actualSize: file.size, file } };
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  /**
   * extensions must not contain dot
   */
  static fileExtensions(allowedExtensions: Array<string>): ValidatorFn {
    const validatorFn = (file: File) => {
      if (allowedExtensions.length === 0) {
        return null;
      }

      if (file instanceof File) {
        const ext = FileValidator.getExtension(file.name);
        if (allowedExtensions.indexOf(ext) === -1) {
          return { fileExtension: { allowedExtensions: allowedExtensions, actualExtension: file.type, file } };
        }
      }
    };
    return FileValidator.fileValidation(validatorFn);
  }

  private static getExtension(filename: string): null | string {
    if (filename.indexOf('.') === -1) {
      return null;
    }
    return filename.split('.').pop();
  }

  private static fileValidation(validatorFn: (File) => null | object): ValidatorFn {
    return (formControl: FormControl) => {
      if (!formControl.value) {
        return null;
      }
      const files: File[] = [];
      const isMultiple = Array.isArray(formControl.value);
      isMultiple
        ? formControl.value.forEach((file: File) => files.push(file))
        : files.push(formControl.value);

      for (const file of files) {
        return validatorFn(file);
      }
      return null;
    };
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
