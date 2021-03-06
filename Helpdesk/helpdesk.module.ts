import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../Shared/Shared.module';
import { HelpdeskComponent } from '../Helpdesk/helpdesk.component';
import { helpdeskrouting } from '../Helpdesk/helpdesk.routing';
import { SelectModule } from 'ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { DashboardComponent } from './Process/Dashboard/Dashboard';
import { NgbPopoverModule, NgbDropdownModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule, NgbDate, NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../src/app/dateformat';
import { SampleComponent } from '../Helpdesk/Process/sample/sample';
import { TicketDetailsComponent } from '../Helpdesk/Process/TicketDetails/TicketDetails';
import { TicketAdditionalDetailsComponent } from '../Helpdesk/Process/TicketAddtionalDetails/TicketAdditionalDetails';
import { SearchComponent } from '../Helpdesk/Process/Search/Search';
import { FilterPipe } from '../src/app/FilterPipe.pipe';
import { KeysPipe } from '../src/app/keys.pipe';
import { ImageDragDirective } from '../../AngularUi/src/app/files-drag.directive';
import { RegistrationDeptComponent } from '../Helpdesk/Process/RegistrationDept/RegistrationDept';
import { TicketRegistrationComponent } from '../Helpdesk/Process/Ticket Registration/TicketRegistration';
import { WeekendholidaystaffComponent } from './Process/WeekendHolidayStaff/weekendholidaystaff.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [HelpdeskComponent, SampleComponent, TicketDetailsComponent, TicketAdditionalDetailsComponent, DashboardComponent,
    FilterPipe, KeysPipe, SearchComponent, ImageDragDirective, RegistrationDeptComponent, TicketRegistrationComponent, WeekendholidaystaffComponent],
  imports: [
    CommonModule,
    helpdeskrouting,
    FormsModule,
    TextMaskModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    SelectModule,
    NgbDropdownModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbModule,
    NgMultiSelectDropDownModule
  ],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class HelpDeskModule {

}
