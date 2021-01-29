import { Component, OnInit, ViewChild, OnDestroy, HostListener, EmbeddedViewRef, ChangeDetectorRef, ElementRef, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
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
import { TTRK_TPROCESS_DTLS } from '../../../Models/Helpdesk/Process/TTRK_TPROCESS_DTLS';
import { TTRK_TCKT_MST, TCKT_DETAILS_SAVE } from '../../../Models/Helpdesk/Process/TTRK_TCKT_MST';
import { ISystemFile, Get_Files } from '../TicketDetails/TicketDetails';
import { FileHandle } from '../../../src/app/files-drag.directive';
import * as fileSaver from 'file-saver';
import { DeleteFilerequest } from '../../../Models/Helpdesk/Process/DeleteFilerequest';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TicketAdditionalDetailsComponent } from '../TicketAddtionalDetails/TicketAdditionalDetails';
import { WeekendholidaystaffComponent } from '../WeekendHolidayStaff/weekendholidaystaff.component';
import { TicketDetails_Models } from '../../../Models/Helpdesk/Process/TicketDetails_Model';

//import { PrimeNGConfig } from 'primeng/api';o
//Started By AJP15179-GuruMurthy Muriki @ 12/22/2020//
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-TicketRegistration',
  templateUrl: './TicketRegistration.html',
  viewProviders: [NgClass],
  providers: [DatePipe],
})
export class TicketRegistrationComponent implements OnInit {
  //Started By AJP15179-GuruMurthy Muriki @ 12/22/2020//
  @ViewChild(TicketAdditionalDetailsComponent) childTicketEvent;
  @ViewChild(TicketAdditionalDetailsComponent, { static: true }) ChildTrigger: TicketAdditionalDetailsComponent;
  @ViewChild('TicketAdditionalId') TicketAdditionalId: ElementRef<HTMLElement>;
  @ViewChild(WeekendholidaystaffComponent) WeekEndComponent;
  MasterDropDowns_Uri: string = "api/Process/TicketRegistrationMaster/";
  Register_Save_Uri: string = "api/Helpdesk/Process/TicketRegistration";
  RegisterHistory_Uri: string = "api/Helpdesk/Process/TicketRegisterHistory/";
  RemoveRegisterTickets_Uri: string = "api/Helpdesk/Process/RemoveTicketRegistration/";
  Post_FilesUpload: string = 'api/Helpdesk/Process/TicketDetailsFilesupload/';
  DeleteFiles_Updatetime_URi = "api/Helpdesk/Process/TicketRegistrationFilesDelete/"; get_TicketTypeDropdown_uri = "api/Helpdesk/Process/SubDepartMentsDetails/";
  get_AdditionalDetail_Url: string = 'api/TicketAdditionalDetails/get_DynamicTicketAdditionalFields';
  @ViewChild('date', { static: true }) d: NgbDatepicker; Fileerrors: Array<string> = []; fileExt: string = "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,txt"; maxFiles: number = 3; maxSize: number = 5;//MB
  Empcode: string; EmployeeName: string; Bay: string; Project: string; Location: string; IsDelete: boolean = false; Is_Single: boolean = null; Is_Multiple: boolean = null; Is_Popup: boolean = false;
  DepCode: number = 0; Btntext: string = "Save"; cancelClicked = false; ticketfiles: Get_Files[] = [];
  TicketRegisterForm: FormGroup; popoverTitle = 'Confirm Delete?'; popoverMessage = 'Are you sure to delete?';
  Submitt = false; ticketHistoryDetailsRegister: any[] = []; ISystemFileS: Array<ISystemFile> = [];
  TCKT_TPROCESS_DTLS: TTRK_TPROCESS_DTLS; TTRK_TCKT_MST: TTRK_TCKT_MST; Tickt_DetailsFinalSave: TCKT_DETAILS_SAVE;
  TicketRegisterDropdowns: any[] = []; ResposibleDept: IOptions[] = []; TicketType: IOptions[] = []; Category: IOptions[] = []; SubCategory: IOptions[] = []; TicketPriority: IOptions[] = [];
  TicketHistoryObj: any; ticketdetails: TicketDetails_Models; IsWeekend: boolean = false; WeekendDeatilslength: string; AproveGrade: IOptions[] = []; AproveAuth: IOptions[] = [];
  constructor(private cdRef: ChangeDetectorRef, private modalService: NgbModal, private _Activatedroute: ActivatedRoute, private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService, private httpClient: HttpClient, private User: UserProfile, private Global: GlobalUtils, private router: Router) {
    this.Empcode = User.getProfile().EmployeeCode;
    this.EmployeeName = '';
    this.DepCode = +_Activatedroute.snapshot.paramMap.get("DeptId");//12;
    this.Tickt_DetailsFinalSave = <TCKT_DETAILS_SAVE>{};
    this.TCKT_TPROCESS_DTLS = <TTRK_TPROCESS_DTLS>{
      CLIENT_SLA_DT: '', ADDNL_MAIL_ID: '', ALARM_DATE: '', AMOUNT_PAID: '', ASSIGNED_TO: '', BAYSOFT_UPDATED: '', FOL_UP_DATE: '', IsHide: '', STATUS_DESC: '',
      TCKT_ID: 0, TCKT_STATUS: 'F', TIME_TAKEN: '', TPROCESS_ID: 0, OLD_DEPT_TPRIORITY_ID: 0, PROCESS_COMMENTS: '', LICENCE_AVLBL: '',
      WAIT_MINS: '', WEIGHTAGE: '', UPDATED_BY: this.User.getProfile().EmployeeCode, Status_Id: 11

    };
    this.TTRK_TCKT_MST = <TTRK_TCKT_MST>{
      TCKT_DESC: '', TCKT_ID: 0, TCKT_Status: 'F', TPROCESS_ID: 0, DEPT_TPRIORITY_ID: 0, UPDATED_BY: this.User.getProfile().EmployeeCode,
      Status_Id: 11,
      CLIENT_SLA_DT: ''
    };
    this.ticketdetails = <TicketDetails_Models>{};
    this.TicketHistoryObj = <any>{};
    this.TicketHistoryObj.Status = '0';
    this.TicketHistoryObj.Tickeft_type = '';
    this.TicketHistoryObj.TicketTypeID = 0;
    this.TicketHistoryObj.Dept_Priorityid = 0;
    this.TicketHistoryObj.ScreenName = '1';
    this.TicketHistoryObj.DeptTypeID = 0;
    this.TicketHistoryObj.Ticketid = 0;
    localStorage.removeItem("Copy");
  }
  ngOnInit() {
    this.ticketHistoryfn();
    this.FormIntit();
    this.get_TICETTYPE_MasterDropDowns();
    this.get_MasterDropDowns();
    this.get_Approve_Grade_Authority();
  }

  ngAfterViewChecked() {
    //explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
    this.cdRef.detectChanges();
  }
  openDialog() {
    setTimeout(() => this.getAddtionaldetails(), 1);
  }
  //Plugin
  getAddtionaldetails() {
    this.http.save(this.TicketHistoryObj, this.get_AdditionalDetail_Url).subscribe((Result: any) => {
      if (Result["Additional_Dtl_Popup"] != null) {
        this.Is_Popup = Result["Additional_Dtl_Popup"];
      }
    });
    if (this.childTicketEvent != undefined)
      this.childTicketEvent.ReinittheForm("0");
  }
  //displayBasic2: boolean;
  //showBasicDialog2() {
  //  this.displayBasic2 = true;
  //}
  decline() {
    this.modalService.dismissAll();
  }
  openModalDelete(content) {
    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
    }).catch((res) => { });
  }
  openBasicModal(content) {
    this.getAddtionaldetails();
    this.modalService.open(content, { size: 'xl' }).result.then((result) => {
    }).catch((res) => { });
  }
  FormIntit() {
    this.TicketRegisterForm = this.formBuilder.group({
      DepartmentName: [''],
      EmployeeName: [''],
      EmployeeCode: [''],
      BayNo: [''],
      ProjectName: [''],
      ProjectId: [''],
      Extension: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(4), Validators.maxLength(10)]],
      Subject: [''],
      TicketTypeId: ['', [Validators.required]],
      CategoryId: ['', [Validators.required]],
      SubCategoryId: ['', [Validators.required]],
      TicketPriorityId: ['', [Validators.required]],
      TicketDescription: ['', [Validators.required]],
      Files: [''],
      ApproveGrade: [''],
      ApproveAuth: ['']
    });
  }
  ticketHistoryfn() {
    this.http.GET(this.RegisterHistory_Uri + this.Empcode + "/" + this.DepCode).subscribe(
      (Result: any) => {
        this.ticketHistoryDetailsRegister = Result["TicketRegisterHistory"];
        this.ticketfiles = Result["result"].filter((K: Get_Files) => K.Filename != "0");

      });
  }

  TicketRegisterSubmit() {
    this.Submitt = true;
    if (this.TicketRegisterForm.invalid)
      return;

    this.Fileerrors = [];
    // Validate file size and allowed extensions Added 12/23/2020
    if (this.ISystemFileS.length > 0 && (!this.isValidFiles(this.ISystemFileS)))
      return;



    let FindDeptPriorityId: any = this.TicketRegisterDropdowns.filter(u => u.DepartmentID == +this.DepCode
      && u.TicketTypeID == parseInt(this.TicketRegisterForm.value.TicketTypeId)
      && u.CategoryID == parseInt(this.TicketRegisterForm.value.CategoryId)
      && u.SubCategoryID == parseInt(this.TicketRegisterForm.value.SubCategoryId)
      && u.PriorityID == parseInt(this.TicketRegisterForm.value.TicketPriorityId)
    );
    let DeptPriorityID = FindDeptPriorityId[0].DeptPriorityID;
    //TCKT_MASTER
    this.TTRK_TCKT_MST.LOCATION = this.Location;
    this.TTRK_TCKT_MST.BAY_NO = this.Bay;
    this.TTRK_TCKT_MST.PROJ_ID = this.TicketRegisterForm.value.ProjectId;
    this.TTRK_TCKT_MST.EXTENSION_NO = this.TicketRegisterForm.value.Extension;
    this.TTRK_TCKT_MST.TCKT_DESC = this.TicketRegisterForm.value.TicketDescription;
    this.TTRK_TCKT_MST.DEPT_TPRIORITY_ID = DeptPriorityID;
    //TProcessDTLS
    this.TCKT_TPROCESS_DTLS.OLD_DEPT_TPRIORITY_ID = DeptPriorityID;
    this.Tickt_DetailsFinalSave.TTRK_TCKT_MST = this.TTRK_TCKT_MST;
    this.Tickt_DetailsFinalSave.TTRK_TPROCESS_DTLS = this.TCKT_TPROCESS_DTLS;
    if (this.TicketRegisterForm.value.TicketTypeId == "49") {
      this.ticketdetails.Comments = "WEEKEND";
      this.Tickt_DetailsFinalSave.TicketDetails_Models = this.ticketdetails;
    }
    else {
      this.ticketdetails.Comments = "NAN";
      this.Tickt_DetailsFinalSave.TicketDetails_Models = this.ticketdetails;
    }
    //Weekend Additional details check 
    if (this.TicketRegisterForm.value.TicketTypeId == "49") {
      if (this.WeekendDeatilslength == "0") {
        this.MsgInfo("Add least one employee in Weekend Staff Additional Details...!");
        return
      }
    }

    const formData = new FormData();
    this.ISystemFileS.forEach(K => {
      formData.append(K.fileName, K.file);
    });
    this.http.save(this.Tickt_DetailsFinalSave, this.Register_Save_Uri).subscribe((Result: any) => {
      this.Btntext = "Save";
      if (this.ISystemFileS.length > 0) {
        this.httpClient.request(new HttpRequest('POST',
          this.Post_FilesUpload + Result.TCKTID + "/" + Result.TPROCESS_ID,
          formData)).subscribe((ResultFile: any) => {
            //  console.log(ResultFile)
          });
      }
      //SaveChildFormData
      if (this.childTicketEvent != undefined)
        this.childTicketEvent.SetTicketId(Result.TCKTID);
      this.childTicketEvent.SubmittChildForm();

      this.IsDelete = false;
      this.ticketHistoryfn();
      this.MsgShow(Result.Msg);
      this.OnReset();
      this.ISystemFileS = [];
      this.Fileerrors = [];
      localStorage.removeItem("Copy");
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
  TprocessDownloadFile(TicketId, TProcessId, Shortname) {
    let Fileset = <Get_Files>{};
    Fileset.Shortname = Shortname;
    Fileset.TProcessId = +TProcessId;
    Fileset.TicketId = +TicketId;
    Fileset.Filename = Shortname;
    this.http.DownloadFile(Shortname, Fileset);
  }
  MsgShow(msg: any) {
    this.toast.success(msg);
  }
  MsgInfo(msg: any) {
    this.toast.info(msg);
  }
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.split('.').pop();
      this.ISystemFileS.push({ fileName: file.name, Type: ext, Size: this.formatBytes(file.size), file: file, css: ext });
      this.IsCheckFiles();
    }
  }
  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  IsCheckFiles() {
    this.Fileerrors = [];
    this.isValidFiles(this.ISystemFileS);
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
  RemoveRegisterTickets() {
    this.http.GET(this.RemoveRegisterTickets_Uri + this.TTRK_TCKT_MST.TCKT_ID).subscribe((Result: any) => {
      this.ticketHistoryfn();
      this.MsgShow(Result.Msg);
      this.decline();
      this.OnReset();
    });
    this.OnReset();
  }
  get_Approve_Grade_Authority() {
    this.http.GET("api/Helpdesk/Process/WeekendApproveAuthorityRole/" + this.User.getProfile().EmployeeCode).subscribe((Result: any) => {
      this.AproveAuth = Result["ApproveAuthority"];
      this.AproveGrade = Result["ApproveGrade"];
    });
  }
  UpdateRegistration(history: any) {
    this.Btntext = "Update";
    this.TicketHistoryObj.Dept_Priorityid = history.DeptPriorityID;
    this.TicketHistoryObj.ScreenName = 'Ticket Registration';
    this.TicketHistoryObj.DeptTypeID = history.DeptTypeID;
    this.TicketHistoryObj.Ticketid = history.TCKT_ID;
    if (this.Is_Popup == false) {
      //without popup
      this.FormIntit();
      this.getAddtionaldetails();
    } else
      this.getAddtionaldetails();

    this.TicketRegisterForm.patchValue({
      EmployeeCode: this.User.getProfile().EmployeeName,
      BayNo: history.LOCATION + "/" + history.BAY_NO,
      ProjectName: this.User.getProfile().ProjectName,
      ProjectId: history.PROJ_ID.toString(),
      Extension: history.EXTENSION_NO,
      Subject: '',
      TicketTypeId: history.TicketTypeID.toString(),
      CategoryId: history.CategoryID.toString(),
      SubCategoryId: history.SubCategoryID.toString(),
      TicketPriorityId: history.PriorityID.toString(),
      TicketDescription: history.TCKT_DESC,
      Files: '',
      EmployeeName: this.User.getProfile().EmployeeName
    });
    this.TTRK_TCKT_MST.TCKT_ID = history.TCKT_ID;
    this.TCKT_TPROCESS_DTLS.TCKT_ID = history.TCKT_ID;
    this.TTRK_TCKT_MST.DEPT_TPRIORITY_ID = history.DeptPriorityID;
    this.TCKT_TPROCESS_DTLS.OLD_DEPT_TPRIORITY_ID = history.DeptPriorityID;
    this.TTRK_TCKT_MST.TPROCESS_ID = history.TPROCESS_ID;
    this.TCKT_TPROCESS_DTLS.TPROCESS_ID = history.TPROCESS_ID;
    let OptTickettype = <IOptions>{ value: history.TicketTypeID.toString(), label: '' };
    let OptCategory = <IOptions>{ value: history.CategoryID.toString(), label: '' };
    let OptSubCategory = <IOptions>{ value: history.SubCategoryID.toString(), label: '' };
    this.OnSelectedTicketType(OptTickettype);
    this.OnSelectedCategory(OptCategory);
    this.OnSelectedSubCategory(OptSubCategory);
    if (history.STATUS_ID.toString() == "11") {
      this.IsDelete = true;
      let FilterFilesObject = this.ticketfiles.filter((k: any) => k.TProcessId == +history.TPROCESS_ID && k.TicketId == +history.TCKT_ID);
      for (let i = 0; i < FilterFilesObject.length; i++) {
        let filesp = <ISystemFile>{};
        var ext = FilterFilesObject[i].Filename.split('.').pop();
        var name = FilterFilesObject[i].Filename.split('.')[0];
        var file = new File([name], name, {
          type: ext,
        });
        filesp.file = file;
        filesp.fileName = FilterFilesObject[i].Shortname;
        filesp.Type = ext;
        filesp.css = ext;
        filesp.Size = "0 KB";
        filesp.isdelete = "1";
        this.ISystemFileS.push(filesp);
      }
    }
    else
      this.IsDelete = false;
    this.IsWeekend = true;
    this.WeekEndComponent.AssignTicketId(history.TCKT_ID, history.DeptPriorityID);
  }
  DeleteSelectedFiles(Filename: any) {
    let Delete = <DeleteFilerequest>{};
    Delete.TPROCESS_ID = this.TCKT_TPROCESS_DTLS.TPROCESS_ID;
    Delete.TCKT_ID = this.TTRK_TCKT_MST.TCKT_ID;
    Delete.Filename = Filename;
    this.http.save(Delete, this.DeleteFiles_Updatetime_URi).subscribe((Result: any) => {
      if (Result == "1" || Result == 1) {
        this.ISystemFileS = this.ISystemFileS.filter(({ fileName }) => fileName !== Filename);
      }
    });
  }
  OnReset() {
    this.Btntext = "Save";
    this.Submitt = false;
    this.IsDelete = false;
    this.TTRK_TCKT_MST.TCKT_ID = 0;
    this.TCKT_TPROCESS_DTLS.TCKT_ID = 0;
    this.TicketRegisterForm.reset();
    this.get_MasterDropDowns();
    this.TicketRegisterForm.controls.EmployeeCode.setValue(this.User.getProfile().EmployeeCode);
  }
  filesDropped(files: FileHandle[]) {
    this.ISystemFileS = files;
  }
  get T() {
    return this.TicketRegisterForm.controls;
  }
  get_TICETTYPE_MasterDropDowns() {
    this.http.GET(this.get_TicketTypeDropdown_uri + this.Empcode + "/" + this.DepCode).subscribe((Result: any) => {
      this.TicketType = this.uniqueBy(this.DynamicArrayCreatePush(Result, "value", "label", "0")).sort(this.dynamicSort("label"));
    });
  }
  get_MasterDropDowns() {
    this.http.GET(this.MasterDropDowns_Uri + this.DepCode + "/" + this.Empcode).subscribe((Result: any) => {
      this.ResposibleDept = this.uniqueBy(this.DynamicArrayCreatePush(Result["ViewCat"], "DepartmentID", "DepartmentName", "0")).sort(this.dynamicSort("label"));
      // this.TicketType = this.uniqueBy(this.DynamicArrayCreatePush(Result["ViewCat"], "TicketTypeID", "TicketType", "0")).sort(this.dynamicSort("label"));
      this.TicketRegisterDropdowns = Result["ViewCat"];
      this.Bay = Result["Bay_Project"][0].Bay;
      this.Location = Result["Bay_Project"][0].LocationBay;
      this.TicketRegisterForm.controls.DepartmentName.setValue(Result["ViewCat"][0].DepartmentName);
      this.TicketRegisterForm.controls.BayNo.setValue(this.Location + "/" + this.Bay);
      this.TicketRegisterForm.controls.ProjectName.setValue(Result["ProjectDetails"][0].ProjectName);
      this.TicketRegisterForm.controls.ProjectId.setValue(Result["ProjectDetails"][0].ProjectId);
      this.TicketRegisterForm.controls.EmployeeName.setValue(this.User.getProfile().EmployeeName);
      this.TicketHistoryObj.DeptTypeID = Result["ViewCat"][0].DeptTypeID;
      // DeptTypeID
      // this.getAddtionaldetails();
    });
  }
  OnSelectedTicketType(option: IOptions) {
    let CatfilterResult: any = this.TicketRegisterDropdowns.filter(u => u.DepartmentID == +this.DepCode && u.TicketTypeID == parseInt(option.value));
    this.Category = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "CategoryID", "Category", "0")).sort(this.dynamicSort("label"));
    if (option.value == "49") {

      this.TicketRegisterForm.controls.ApproveGrade.setValidators([Validators.required]);
      this.TicketRegisterForm.controls.ApproveGrade.updateValueAndValidity();

      this.TicketRegisterForm.controls.ApproveAuth.setValidators([Validators.required]);
      this.TicketRegisterForm.controls.ApproveAuth.updateValueAndValidity();
    }
  }
  OnSelectedCategory(option: IOptions) {
    let TicketTypeID = this.TicketRegisterForm.get("TicketTypeId").value;
    let CatfilterResult: any = this.TicketRegisterDropdowns.filter(u => u.DepartmentID == +this.DepCode && u.TicketTypeID == TicketTypeID && u.CategoryID == parseInt(option.value));
    this.SubCategory = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "SubCategoryID", "SubCategory", "0")).sort(this.dynamicSort("label"));
  }
  OnSelectedSubCategory(option: IOptions) {
    let TicketTypeID = this.TicketRegisterForm.get("TicketTypeId").value;
    let CategoryID = this.TicketRegisterForm.get("CategoryId").value;
    let CatfilterResult: any = this.TicketRegisterDropdowns.filter(u => u.SubCategoryID == +option.value && u.DepartmentID == +this.DepCode && u.TicketTypeID == TicketTypeID && u.CategoryID == parseInt(CategoryID));
    this.TicketPriority = this.uniqueBy(this.DynamicArrayCreatePush(CatfilterResult, "PriorityID", "Priority", "0"));
    this.TicketPriority = this.TicketPriority.sort(this.dynamicSort("label"));
  }
  TicketPriorityChange(option: IOptions) {
    let TicketTypeID = this.TicketRegisterForm.get("TicketTypeId").value;
    let CategoryID = this.TicketRegisterForm.get("CategoryId").value;
    let SubCategoryID = this.TicketRegisterForm.get("SubCategoryId").value;
    let CatfilterResult: any = this.TicketRegisterDropdowns.filter(u => u.PriorityID == option.value && u.SubCategoryID == SubCategoryID && u.DepartmentID == +this.DepCode && u.TicketTypeID == TicketTypeID && u.CategoryID == parseInt(CategoryID));
    this.TicketHistoryObj.Dept_Priorityid = CatfilterResult[0].DeptPriorityID;
    this.TicketHistoryObj.DeptTypeID = CatfilterResult[0].DeptTypeID;
    this.getAddtionaldetails();
    //weenend Componenet
    if (this.TicketRegisterForm.get("TicketTypeId").value == "49") {
      this.WeekEndComponent.AssignTicketId(0, this.TicketHistoryObj.Dept_Priorityid);
      this.IsWeekend = true;
    }
  }
  ReturnToParentHander($event: any) {
    this.WeekendDeatilslength = $event;
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
  dateToString = (date) => `${isNumber(date.month) ? padNumber(date.month) : ''}/${isNumber(date.day) ? padNumber(date.day) : ''}/${date.year}`;
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}
export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
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


