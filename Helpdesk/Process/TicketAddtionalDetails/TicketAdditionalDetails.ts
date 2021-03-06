import { ChangeDetectorRef,Component, OnInit, ViewChild, OnDestroy, HostListener, Input, Output, EventEmitter, AfterViewInit, AfterContentChecked} from '@angular/core';
import { ApiSharedService } from '../../../Services/APIHelper';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net'
import { IOptions } from '../../../Models/Helpdesk/Process/IOptions';
import { TicketDetails_Models } from '../../../Models/Helpdesk/Process/TicketDetails_Model';
import { TicketHistory } from '../../../Models/Helpdesk/Process/TicketHistory_Model';
import { ValidatorFn, FormGroup, FormControl, Validators, FormBuilder, NgForm, Form, FormArray } from '@angular/forms';
import { SelectComponent } from 'ng-select';
import { map } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { UserProfile } from '../../../Global/UserProfile';
import { GlobalUtils } from '../../../Global/Globalvariables';
import { NgClass, DatePipe } from '@angular/common';
import { NgbDate, NgbDateParserFormatter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
//Here is the Models
import { TTRK_TCKT_Additional_Details } from '../../../Models/Helpdesk/Process/TTRK_TCKT_Additional_Details';
import { TTRK_KNOWLEDGE_BASE } from '../../../Models/Helpdesk/Process/TTRK_KNOWLEDGE_BASE';
import { TTRK_TPROCESS_DTLS } from '../../../Models/Helpdesk/Process/TTRK_TPROCESS_DTLS';
import { TTRK_TCKT_MST, TCKT_DETAILS_SAVE, TCKT_DETAILS_MULTI } from '../../../Models/Helpdesk/Process/TTRK_TCKT_MST';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-ticketadditionaldetails',
  templateUrl: './TicketAdditionalDetails.html',
  viewProviders: [NgClass],
  providers: [DatePipe]
})
export class TicketAdditionalDetailsComponent implements OnInit {
  private get_AdditionalDetail_Url: string = 'api/TicketAdditionalDetails/get_DynamicTicketAdditionalFields';
  private Save_AdditionalDetail_Uri: string = 'api/Helpdesk/Process/TicketAdditionalDetailsSave';
  private Multi_AdditionalDetail_Uri: string = 'api/Helpdesk/Process/TicketAdditionalDetails_Multiple_Save';
  @Input() Status: any;
  @Input() submitted: boolean;
  @Input() ScreenName: string;
  @Input() TicketDetails: string;
  Dynamicformarrya: any;
  @Input() Ticketid: number;
  @Input() DynamicForm: FormGroup;
  @Input() validationSet: boolean;
  @ViewChild('date', { static: true }) d: NgbDatepicker;
  @Input() CommonObject: any;
  @Output() Uniqueid: EventEmitter<any> = new EventEmitter<any>();
  @Output() IsTicketRegistration: EventEmitter<any> = new EventEmitter<any>();
  TCKT_Additional_Details: TTRK_TCKT_Additional_Details;
  TCKT_KNOWLEDGE_BASE: TTRK_KNOWLEDGE_BASE;
  Tickt_DetailsFinalSave: TCKT_DETAILS_SAVE;
  Tickt_DeatilsFinalMultiSave: TCKT_DETAILS_MULTI;
  TicketDetails_Models: TicketDetails_Models;
  Previous_tbl: string = "";
  SIngle_Multiple: string = 'NAN';
  addrow_btn: boolean = false;
  MultiColumnsarryaObject: any;
  AddtionalDetails: any;
  CheckVariable: string;
  EachObject: any;
  TCKT_Additional_DetailsList: TTRK_TCKT_Additional_Details[] = [];
  TCKT_Knowledge_BaseList: TTRK_KNOWLEDGE_BASE[] = [];
  constructor(private datepipe: DatePipe, private http: ApiSharedService, private formBuilder: FormBuilder, private toast: ToastrService, private httpClient: HttpClient, private User: UserProfile, private Global: GlobalUtils) {
    this.Tickt_DetailsFinalSave = <TCKT_DETAILS_SAVE>{};
    this.Tickt_DeatilsFinalMultiSave = <TCKT_DETAILS_MULTI>{};
    this.TCKT_Additional_Details = <TTRK_TCKT_Additional_Details>{
      TicketId: this.Ticketid, Filler1: '', Filler2: '', Filler3: '', Filler4: '', Filler5: '', Filler6: '', Filler7: '', Filler8: '', Filler9: '', Filler10: '',
      Filler11: 0, Filler12: 0, Filler13: 0, Filler14: 0, Filler15: 0, Filler16: 0, Filler17: 0, Filler18: 0, Filler19: 0, Filler20: 0,
      Filler21: '', Filler22: '', Filler23: '', Filler24: '', Filler25: '', Filler26: '', Filler27: '', Filler28: '', Filler29: '', Filler30: '',
      Filler31: '', Filler32: '', Filler33: '', Filler34: '', Filler35: '', Filler36: '', Filler37: '', Filler38: '', Filler39: '', Filler40: '',
      Updated_By: this.User.getProfile().EmployeeCode,
      Updated_Dt: new Date()
    };
    this.TCKT_KNOWLEDGE_BASE = <TTRK_KNOWLEDGE_BASE>{
      CAPA_DTL: '', CAP_EFFECTIVENESS_AGREE: '', CAP_NOT_ACCEPT_REASON: '', CAT_ID: 0, IAD_IMPACT: '', IAD_MODULE_COUNT: '',
      IAD_MODULE_HRS: '', IAD_REPORTS_COUNT: '', IAD_REPORTS_HRS: '', IAD_SCREEN_COUNT: '', IAD_SCREEN_HRS: '',
      DOWNTIME: '', FAULT_ID: '', KNOWLEDGE_DESC: '', TCKT_ID: this.Ticketid, PREVENTIVE_ACTION: '', OLD_CAP: '', OLD_RCA: '', SW_PROJ_ID: 0,
      STATUS: 'A', SUBCAT_ID: 0, RCA_DTL: '', REVIEWED_BY: '', REVIEWED_DT: null, UPDATED_DT: new Date(),
      UPDATED_BY: this.User.getProfile().EmployeeCode
    };
    this.TicketDetails_Models = <TicketDetails_Models>{};
    this.TicketDetails_Models.Physical_Table_Name = '';
  }
  ngOnInit() {
    if (this.ScreenName != undefined) {
      if (this.ScreenName.toLocaleUpperCase() == "Ticket Details".toLocaleUpperCase() || this.ScreenName=="2") {
        this.TCKT_KNOWLEDGE_BASE.TCKT_ID = this.Ticketid;
        this.TCKT_Additional_Details.TicketId = this.Ticketid;
      }
    }
   this.get_DynamicFormFiledsvalues();  
  }
  removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }    
  ReinittheForm(status) {   
    this.get_DynamicFormFiledsvalues();
  }
  SetTicketId(TicketId) {
    this.Ticketid = TicketId;
    this.TCKT_Additional_Details.TicketId = TicketId;
  }
  get_DynamicFormFiledsvalues() { 
    this.Dynamicformarrya = [];
    this.AddtionalDetails = [];    
    this.http.save(this.CommonObject, this.get_AdditionalDetail_Url).subscribe((Result: any) => {  
      if (Result.length != 0) {
        this.CheckVariable = Result["Result"][0].Addition_Fields_Type;
        if (Result["Result"][0].Addition_Fields_Type.toLowerCase() == "Single".toLowerCase()) {          
          this.SIngle_Multiple = 'S';          
          let Data: any = {
            Unique_Id: Result["Result"][0].Unique_Id,
            Physical_Table_Name: Result["Result"][0].Physical_Table_Name
          };
          this.TCKT_Additional_Details.Additional_Id = Result["Result"][0].Unique_Id;
          this.TCKT_KNOWLEDGE_BASE.KNOWLEDGE_ID = Result["Result"][0].Unique_Id;
          //this.TicketDetails_Models.Physical_Table_Name = Result["Result"][0].Physical_Table_Name;
          this.TicketDetails_Models.Physical_Table_Name = "";
          for (var i = 0; i < Result["Result"].length - 1; i++) {
            if (i > 0) {
              if (Result["Result"][i].Physical_Table_Name != this.Previous_tbl) {
                this.TicketDetails_Models.Physical_Table_Name += "," + Result["Result"][i].Physical_Table_Name;
              }
            }
            else {
              this.TicketDetails_Models.Physical_Table_Name = Result["Result"][i].Physical_Table_Name;
            }
            

            this.Previous_tbl = Result["Result"][0].Physical_Table_Name;
          }
          this.Dynamicformarrya = Result["Result"].filter((R: any) => R.StatusId.toString() == this.CommonObject.Status.toString() || R.StatusId.toString() == 0);
          this.constrols();         
        }
        else {
          this.Dynamicformarrya = [];
          this.addrow_btn = false;
          this.TicketDetails_Models.Physical_Table_Name = Result["Result"][0].Physical_Table_Name;
          this.DynamicForm.removeControl("Table");
          this.SIngle_Multiple = 'M';
          // || R.StatusId.toString() == 0) && (R.Screen_Id.toString() == this.CommonObject.ScreenName.toString() || R.ScreenName == '0' || R.ScreenName == "" || R.ScreenName == 'undefined' || R.ScreenName == undefined
          this.Dynamicformarrya = Result["Result"].filter((R: any) => (R.StatusId.toString() == this.CommonObject.Status.toString() || R.StatusId.toString() == 0) && (R.Screen_Id.toString() == this.CommonObject.ScreenName.toString()));
          this.AddtionalDetails = Result["Result1"];
          this.MultiColumnsarryaObject = this.uniqueBy(this.Dynamicformarrya);
          this.DynamicForm.addControl("Table", this.formBuilder.array([]));
          const Table = this.DynamicForm.controls.Table as FormArray;
          
            for (var i = 0; i < this.AddtionalDetails.length; i++) {
              this.EachObject = null;
              this.EachObject = this.Dynamicformarrya.filter((M: any) => M.Unique_Id == this.AddtionalDetails[i].Additional_Id || this.AddtionalDetails[i].KNOWLEDGE_ID);
              let Id = this.AddtionalDetails[i].Additional_Id || this.AddtionalDetails[i].KNOWLEDGE_ID;
              let newGroup = this.formBuilder.group({
              });
              for (let j = 0; j < this.EachObject.length; j++) {
                if (this.EachObject[j].Is_Mandate == true)
                  newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data, [Validators.required,this.EachObject[j].Minimum_Value == null ? null : Validators.minLength(this.EachObject[j].Minimum_Value), this.EachObject[j].Maximum_Value == null ? null : Validators.maxLength(this.EachObject[j].Maximum_Value)]));
                else
                  newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data));
                if (j == 0) {
                  newGroup.addControl('Unique_Id', new FormControl(Id));
                  newGroup.addControl('Physical_Table_Name', new FormControl(this.EachObject[j].Physical_Table_Name));
                }
              }
              Table.push(newGroup);
          }
          if (this.AddtionalDetails.length == 0) {
            this.SIngle_Multiple = 'M';
            this.addrow_btn = true;
            for (var i = 0; i < this.Dynamicformarrya.length; i++) {
              if (i == 0) {
                let newGroup = this.formBuilder.group({
                });
                this.EachObject = null;
                this.EachObject = this.Dynamicformarrya;                
                for (let j = 0; j < this.EachObject.length; j++) {
                  if (this.EachObject[i].Is_Mandate == true)
                    newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data, [Validators.required]));
                  else
                    newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data));
                  if (j == 0) {
                    newGroup.addControl('Unique_Id', new FormControl(this.EachObject[j].Unique_Id));
                    newGroup.addControl('Physical_Table_Name', new FormControl(this.EachObject[j].Physical_Table_Name));
                  }
                }
                Table.push(newGroup);
              }
            }
          }
        }
      }
      if (Result.length == 0) {
        this.SIngle_Multiple = 'NAN';
        let Data: any = {
          Unique_Id: 0,
          Physical_Table_Name: ""
        };
        //this.Uniqueid.emit(Data);
        
      }
    });
  }
  addInput(): void {
    const arrayControl = <FormArray>this.DynamicForm.controls['formArray'];
    let newGroup = this.formBuilder.group({
    });
    arrayControl.push(newGroup);
  }
  onDeleteRow(Unique_id: number, i: number): void {
    this.TableofTableRowArray.removeAt(i)
  }
  get TableofTableRowArray(): FormArray {
    return this.DynamicForm.get('Table') as FormArray;
  }
  addNewRow(): void {
    if (this.AddtionalDetails.length == 0) {
      this.addrow_btn = true;
      let COpyarray: any = this.Dynamicformarrya;
      let UniqueIdsArray = this.uniqueByUnique_Id(this.Dynamicformarrya).sort((a, b) => b - a)[0].Unique_Id;
      let senario: any[] = [];
      for (var i = 0; i < COpyarray.filter((M: any) => M.Unique_Id == UniqueIdsArray).length; i++) {
        let DynamicFormCreate = <any>{
          Addition_Fields_Type: COpyarray[i].Addition_Fields_Type,
          Array_Sequence_No: COpyarray[i].Array_Sequence_No,
          CONTROL_DESC: COpyarray[i].CONTROL_DESC,
          Control_Id: COpyarray[i].Control_Id,
          Control_Pattern: COpyarray[i].Control_Pattern,
          Dependant_Field_Map_Id: COpyarray[i].Dependant_Field_Map_Id,
          Dependant_Options: COpyarray[i].Dependant_Options,
          DependentFieldName: COpyarray[i].DependentFieldName,
          Dept_Tpriority_Id: COpyarray[i].Dept_Tpriority_Id,
          Dept_Type_Id: COpyarray[i].Dept_Type_Id,
          Display_Name: COpyarray[i].Display_Name,
          Display_Sequence_No: COpyarray[i].Display_Sequence_No,
          Field_Id: COpyarray[i].Field_Id,
          Field_Map_Id: COpyarray[i].Field_Map_Id,
          Field_Name: COpyarray[i].Field_Name,
          Field_Screen_Map_Id: COpyarray[i].Field_Screen_Map_Id,
          Field_Table_Desc: COpyarray[i].Field_Table_Desc,
          Field_Table_Id: COpyarray[i].Field_Table_Id,
          Field_Table_Name: COpyarray[i].Field_Table_Name,
          Field_Type: COpyarray[i].Field_Type,
          Is_Dependant: COpyarray[i].Is_Dependant,
          Is_Encrypt_Field: COpyarray[i].Is_Encrypt_Field,
          Is_Mandate: COpyarray[i].Is_Mandate,
          Is_Numeric: COpyarray[i].Is_Numeric,
          Is_Readonly: COpyarray[i].Is_Readonly,
          Maximum_Value: COpyarray[i].Maximum_Value,
          Minimum_Value: COpyarray[i].Minimum_Value,
          Options: COpyarray[i].Options,
          Physical_Field_Name: COpyarray[i].Physical_Field_Name,
          Physical_Table_DataType: COpyarray[i].Physical_Table_DataType,
          Physical_Table_Name: COpyarray[i].Physical_Table_Name,
          Screen_Id: COpyarray[i].Screen_Id,
          Screen_Name: COpyarray[i].Screen_Name,
          Status: COpyarray[i].Status,
          StatusId: COpyarray[i].StatusId,
          TicketType: COpyarray[i].TicketType,
          Unique_Id: UniqueIdsArray+1,
          Validation_Message: COpyarray[i].Validation_Message,
          data: COpyarray[i].data
        };
        senario.push(DynamicFormCreate);        
        if (i == 0) {
          let newGroup = this.formBuilder.group({
          });
          this.EachObject = null;
          this.EachObject = this.Dynamicformarrya.filter((M: any) => M.Unique_Id == UniqueIdsArray);
          for (let j = 0; j < this.EachObject.length; j++) {
            if (this.EachObject[j].Is_Mandate == true)
              newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data, [Validators.required]));
            else
              newGroup.addControl(this.EachObject[j].Physical_Field_Name, new FormControl(this.EachObject[j].data));
            if (j == 0) {
              newGroup.addControl('Unique_Id', new FormControl(UniqueIdsArray+1));
              newGroup.addControl('Physical_Table_Name', new FormControl(this.EachObject[j].Physical_Table_Name));
            }
          }
          this.TableofTableRowArray.push(newGroup);
        }
      }
      this.Dynamicformarrya = [...this.Dynamicformarrya, ...senario];
    }  
  }
  
  uniqueBy(arrobj) {
    let obj2 = {};
    const unique2 = (arr) => {
      let result = [];
      arr.forEach((item, i) => {
        obj2[item['Display_Name']] = i;
      });
      for (let key in obj2) {
        let index = obj2[key];
        result.push(arr[index])
      }
      return result;
    }
    return unique2(arrobj)
  }
  uniqueByUnique_Id(arrobj) {
    let obj2 = {};
    const unique2 = (arr) => {
      let result = [];
      arr.forEach((item, i) => {
        obj2[item['Unique_Id']] = i;
      });
      for (let key in obj2) {
        let index = obj2[key];
        result.push(arr[index])
      }
      return result;
    }
    return unique2(arrobj)
  }
  createItem(Result: any): FormGroup {
    return this.formBuilder.group({
      Test1: '',
      Test2: '',
      Test3: ''
    });

  }
  constrols() {
    this.Dynamicformarrya.forEach((K: any) => {
      if (K.Is_Mandate == true)
        this.DynamicForm.addControl(K.Physical_Field_Name, new FormControl(K.data, Validators.required));
      else
        this.DynamicForm.addControl(K.Physical_Field_Name, new FormControl(K.data));
    });
  }
  SubmittChildForm() {
    if (this.SIngle_Multiple == "M")
      this.MultipleRequestedSubmitt();
    else
      this.SingleFormSubmitt();
  }
  MultipleRequestedSubmitt() {
    var GetArrayFormData = this.DynamicForm.controls['Table'].value;
    this.TCKT_Additional_DetailsList = [];
    this.TCKT_Knowledge_BaseList = [];
    GetArrayFormData.forEach(K => {
      let IterateEachObject = GetArrayFormData.filter((l: any) => l.Unique_Id == K.Unique_Id);
      let TCKT_Additional_Details = <TTRK_TCKT_Additional_Details>{};
      TCKT_Additional_Details.TicketId = this.Ticketid;
      TCKT_Additional_Details.Updated_By = this.User.getProfile().EmployeeCode;
      let Tckt_Knowledge_Bbasedetails = <TTRK_KNOWLEDGE_BASE>{};
      Tckt_Knowledge_Bbasedetails.TCKT_ID = this.Ticketid;
      Tckt_Knowledge_Bbasedetails.UPDATED_BY = this.User.getProfile().EmployeeCode;
      IterateEachObject.forEach(item => {
        for (const [key, value] of Object.entries(item)) {
          switch (key) {
            case "Unique_Id":
              TCKT_Additional_Details.Additional_Id = +value;
              Tckt_Knowledge_Bbasedetails.KNOWLEDGE_ID = +value;
              if (this.addrow_btn == true) {
                TCKT_Additional_Details.Additional_Id = 0;
                Tckt_Knowledge_Bbasedetails.KNOWLEDGE_ID = 0;
              }
              break;
            case "Filler1":
              TCKT_Additional_Details.Filler1 = value.toString();
              break;
            case "Filler2":
              TCKT_Additional_Details.Filler2 = value.toString();
              break;
            case "Filler3":
              TCKT_Additional_Details.Filler3 = value.toString();
              break;
            case "Filler4":
              TCKT_Additional_Details.Filler4 = value.toString();
              break;
            case "Filler5":
              TCKT_Additional_Details.Filler5 = value.toString();
              break;
            case "Filler6":
              TCKT_Additional_Details.Filler6 = value.toString();
              break;
            case "Filler7":
              TCKT_Additional_Details.Filler7 = value.toString();
              break;
            case "Filler8":
              TCKT_Additional_Details.Filler8 = value.toString();
              break;
            case "Filler9":
              TCKT_Additional_Details.Filler9 = value.toString();
              break;
            case "Filler10":
              TCKT_Additional_Details.Filler10 = value.toString();
              break;
            case "Filler11":
              TCKT_Additional_Details.Filler11 = +value;
              break;
            case "Filler12":
              TCKT_Additional_Details.Filler12 = +value;
              break;
            case "Filler13":
              TCKT_Additional_Details.Filler13 = +value;
            case "Filler14":
              TCKT_Additional_Details.Filler14 = +value;
              break;
            case "Filler15":
              TCKT_Additional_Details.Filler15 = +value.toString();
              break;
            case "Filler16":
              TCKT_Additional_Details.Filler16 = +value;
            case "Filler17":
              TCKT_Additional_Details.Filler17 = +value;
              break;
            case "Filler18":
              TCKT_Additional_Details.Filler18 = +value;
              break;
            case "Filler19":
              TCKT_Additional_Details.Filler19 = +value;
              break;
            case "Filler20":
              TCKT_Additional_Details.Filler20 = +value;
              break;
            case "Filler21":
              TCKT_Additional_Details.Filler21 = +value;
              break;
            case "Filler22":
              TCKT_Additional_Details.Filler22 = +value;
              break;
            case "Filler23":
              TCKT_Additional_Details.Filler23 = +value;
              break;
            case "Filler24":
              TCKT_Additional_Details.Filler24 = +value;
              break;
            case "Filler25":
              TCKT_Additional_Details.Filler25 = +value;
              break;
            case "Filler26":
              TCKT_Additional_Details.Filler26 = +value;
              break;
            case "Filler27":
              TCKT_Additional_Details.Filler27 = +value;
              break;
            case "Filler28":
              TCKT_Additional_Details.Filler28 = +value;
              break;
            case "Filler29":
              TCKT_Additional_Details.Filler29 = +value;
              break;
            case "Filler30":
              TCKT_Additional_Details.Filler30 = +value;
              break;
            //Knowledgebase
            case "SW_PROJ_ID":
              Tckt_Knowledge_Bbasedetails.SW_PROJ_ID = +value;
              break;
            case "FAULT_ID":
              Tckt_Knowledge_Bbasedetails.FAULT_ID = +value;
              break;
            case "RCA_DTL":
              Tckt_Knowledge_Bbasedetails.RCA_DTL = value.toString();
              break;
            case "CAPA_DTL":
              Tckt_Knowledge_Bbasedetails.CAPA_DTL = value.toString();
              break;
            case "SUBCAT_ID":
              Tckt_Knowledge_Bbasedetails.SUBCAT_ID = +value;
              break;
            case "CAP_EFFECTIVENESS_AGREE":
              Tckt_Knowledge_Bbasedetails.CAP_EFFECTIVENESS_AGREE = value.toString();
              break;
            case "CAP_NOT_ACCEPT_REASON":
              Tckt_Knowledge_Bbasedetails.CAP_NOT_ACCEPT_REASON = value.toString();
              break;
            case "DOWNTIME":
              Tckt_Knowledge_Bbasedetails.DOWNTIME = value.toString();
              break;
            case "IAD_IMPACT":
              Tckt_Knowledge_Bbasedetails.IAD_IMPACT = value.toString();
              break;
            case "IAD_MODULE_COUNT":
              Tckt_Knowledge_Bbasedetails.IAD_MODULE_COUNT = value.toString();
              break;
            case "IAD_REPORTS_COUNT":
              Tckt_Knowledge_Bbasedetails.IAD_REPORTS_COUNT = value.toString();
              break;
            case "IAD_REPORTS_HRS":
              Tckt_Knowledge_Bbasedetails.IAD_REPORTS_HRS = value.toString();
              break;
            case "IAD_SCREEN_COUNT":
              Tckt_Knowledge_Bbasedetails.IAD_SCREEN_COUNT = value.toString();
              break;
            case "IAD_SCREEN_HRS":
              Tckt_Knowledge_Bbasedetails.IAD_SCREEN_HRS = value.toString();
              break;
            case "KNOWLEDGE_DESC":
              Tckt_Knowledge_Bbasedetails.KNOWLEDGE_DESC = value.toString();
              break;
            case "OLD_CAP":
              Tckt_Knowledge_Bbasedetails.OLD_CAP = value.toString();
              break;
            case "OLD_RCA":
              Tckt_Knowledge_Bbasedetails.OLD_RCA = value.toString();
              break;
            case "PREVENTIVE_ACTION":
              Tckt_Knowledge_Bbasedetails.PREVENTIVE_ACTION = value.toString();
              break;
          }
        }
      });
      this.TCKT_Additional_DetailsList.push(TCKT_Additional_Details);
      this.TCKT_Knowledge_BaseList.push(Tckt_Knowledge_Bbasedetails);
    });
    this.Tickt_DeatilsFinalMultiSave.TicketDetails_Models = this.TicketDetails_Models;
    this.Tickt_DeatilsFinalMultiSave.TTRK_KNOWLEDGE_BASE = this.TCKT_Knowledge_BaseList;
    this.Tickt_DeatilsFinalMultiSave.TTRK_TCKT_Additional_Details = this.TCKT_Additional_DetailsList;    
    this.http.save(this.Tickt_DeatilsFinalMultiSave, this.Multi_AdditionalDetail_Uri).subscribe((Result: any) => {
      console.log(Result.Msg);
    });
  }
  SingleFormSubmitt() {
    for (const field in this.DynamicForm.controls) {
      switch (field) {
        case "Filler1":
          this.TCKT_Additional_Details.Filler1 = this.DynamicForm.controls[field].value;
          break;
        case "Filler2":
          this.TCKT_Additional_Details.Filler2 = this.DynamicForm.controls[field].value;
          break;
        case "Filler3":
          this.TCKT_Additional_Details.Filler3 = this.DynamicForm.controls[field].value;
          break;
        case "Filler4":
          this.TCKT_Additional_Details.Filler4 = this.DynamicForm.controls[field].value;
          break;
        case "Filler5":
          this.TCKT_Additional_Details.Filler5 = this.DynamicForm.controls[field].value;
          break;
        case "Filler6":
          this.TCKT_Additional_Details.Filler6 = this.DynamicForm.controls[field].value;
          break;
        case "Filler7":
          this.TCKT_Additional_Details.Filler7 = this.DynamicForm.controls[field].value;
          break;
        case "Filler8":
          this.TCKT_Additional_Details.Filler8 = this.DynamicForm.controls[field].value;
          break;
        case "Filler9":
          this.TCKT_Additional_Details.Filler9 = this.DynamicForm.controls[field].value;
          break;
        case "Filler10":
          this.TCKT_Additional_Details.Filler10 = this.DynamicForm.controls[field].value;
          break;
        case "Filler11":
          this.TCKT_Additional_Details.Filler11 = this.DynamicForm.controls[field].value;
          break;
        case "Filler12":
          this.TCKT_Additional_Details.Filler12 = this.DynamicForm.controls[field].value;
          break;
        case "Filler13":
          this.TCKT_Additional_Details.Filler13 = this.DynamicForm.controls[field].value;
        case "Filler14":
          this.TCKT_Additional_Details.Filler14 = this.DynamicForm.controls[field].value;
          break;
        case "Filler15":
          this.TCKT_Additional_Details.Filler15 = this.DynamicForm.controls[field].value;
          break;
        case "Filler16":
          this.TCKT_Additional_Details.Filler16 = this.DynamicForm.controls[field].value;
        case "Filler17":
          this.TCKT_Additional_Details.Filler17 = this.DynamicForm.controls[field].value;
          break;
        case "Filler18":
          this.TCKT_Additional_Details.Filler18 = this.DynamicForm.controls[field].value;
          break;
        case "Filler19":
          this.TCKT_Additional_Details.Filler19 = this.DynamicForm.controls[field].value;
          break;
        case "Filler20":
          this.TCKT_Additional_Details.Filler20 = this.DynamicForm.controls[field].value;
          break;
        case "Filler21":
          this.TCKT_Additional_Details.Filler21 = this.DynamicForm.controls[field].value;
          break;
        case "Filler22":
          this.TCKT_Additional_Details.Filler22 = this.DynamicForm.controls[field].value;
          break;
        case "Filler23":
          this.TCKT_Additional_Details.Filler23 = this.DynamicForm.controls[field].value;
          break;
        case "Filler24":
          this.TCKT_Additional_Details.Filler24 = this.DynamicForm.controls[field].value;
          break;
        case "Filler25":
          this.TCKT_Additional_Details.Filler25 = this.DynamicForm.controls[field].value;
          break;
        case "Filler26":
          this.TCKT_Additional_Details.Filler26 = this.DynamicForm.controls[field].value;
          break;
        case "Filler27":
          this.TCKT_Additional_Details.Filler27 = this.DynamicForm.controls[field].value;
          break;
        case "Filler28":
          this.TCKT_Additional_Details.Filler28 = this.DynamicForm.controls[field].value;
          break;
        case "Filler29":
          this.TCKT_Additional_Details.Filler29 = this.DynamicForm.controls[field].value;
          break;
        case "Filler30":
          this.TCKT_Additional_Details.Filler30 = this.DynamicForm.controls[field].value;
          break;
        //Knowledgebase
        case "SW_PROJ_ID":
          this.TCKT_KNOWLEDGE_BASE.SW_PROJ_ID = this.DynamicForm.controls[field].value;
          break;
        case "FAULT_ID":
          this.TCKT_KNOWLEDGE_BASE.FAULT_ID = this.DynamicForm.controls[field].value;
          break;
        case "RCA_DTL":
          this.TCKT_KNOWLEDGE_BASE.RCA_DTL = this.DynamicForm.controls[field].value;
          break;
        case "CAPA_DTL":
          this.TCKT_KNOWLEDGE_BASE.CAPA_DTL = this.DynamicForm.controls[field].value;
          break;
        case "SUBCAT_ID":
          this.TCKT_KNOWLEDGE_BASE.SUBCAT_ID = this.DynamicForm.controls[field].value;
          break;
        case "CAP_EFFECTIVENESS_AGREE":
          this.TCKT_KNOWLEDGE_BASE.CAP_EFFECTIVENESS_AGREE = this.DynamicForm.controls[field].value;
          break;
        case "CAP_NOT_ACCEPT_REASON":
          this.TCKT_KNOWLEDGE_BASE.CAP_NOT_ACCEPT_REASON = this.DynamicForm.controls[field].value;
          break;
        case "DOWNTIME":
          this.TCKT_KNOWLEDGE_BASE.DOWNTIME = this.DynamicForm.controls[field].value;
          break;
        case "IAD_IMPACT":
          this.TCKT_KNOWLEDGE_BASE.IAD_IMPACT = this.DynamicForm.controls[field].value;
          break;
        case "IAD_MODULE_COUNT":
          this.TCKT_KNOWLEDGE_BASE.IAD_MODULE_COUNT = this.DynamicForm.controls[field].value;
          break;
        case "IAD_REPORTS_COUNT":
          this.TCKT_KNOWLEDGE_BASE.IAD_REPORTS_COUNT = this.DynamicForm.controls[field].value;
          break;
        case "IAD_REPORTS_HRS":
          this.TCKT_KNOWLEDGE_BASE.IAD_REPORTS_HRS = this.DynamicForm.controls[field].value;
          break;
        case "IAD_SCREEN_COUNT":
          this.TCKT_KNOWLEDGE_BASE.IAD_SCREEN_COUNT = this.DynamicForm.controls[field].value;
          break;
        case "IAD_SCREEN_HRS":
          this.TCKT_KNOWLEDGE_BASE.IAD_SCREEN_HRS = this.DynamicForm.controls[field].value;
          break;
        case "KNOWLEDGE_DESC":
          this.TCKT_KNOWLEDGE_BASE.KNOWLEDGE_DESC = this.DynamicForm.controls[field].value;
          break;
        case "OLD_CAP":
          this.TCKT_KNOWLEDGE_BASE.OLD_CAP = this.DynamicForm.controls[field].value;
          break;
        case "OLD_RCA":
          this.TCKT_KNOWLEDGE_BASE.OLD_RCA = this.DynamicForm.controls[field].value;
          break;
        case "PREVENTIVE_ACTION":
          this.TCKT_KNOWLEDGE_BASE.PREVENTIVE_ACTION = this.DynamicForm.controls[field].value;
          break;
      }
    }
    this.Tickt_DetailsFinalSave.TTRK_TCKT_Additional_Details = this.TCKT_Additional_Details;
    this.Tickt_DetailsFinalSave.TTRK_KNOWLEDGE_BASE = this.TCKT_KNOWLEDGE_BASE;
    this.Tickt_DetailsFinalSave.TicketDetails_Models = this.TicketDetails_Models;
    this.http.save(this.Tickt_DetailsFinalSave, this.Save_AdditionalDetail_Uri).subscribe((Result: any) => {
      console.log(Result.Msg);
    });
  }

}
export interface MappingField {
  DeptTypeID: number;
  Dept_Priorityid: number
  ScreenName: string;
  Status: string;
  Tickeft_type: string;
  TicketTypeID: number;
  Ticketid: number;
}
