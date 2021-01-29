import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleComponent } from '../Helpdesk/Process/sample/sample';
import { HelpdeskComponent } from '../Helpdesk/helpdesk.component';
import { TicketDetailsComponent } from '../Helpdesk/Process/TicketDetails/TicketDetails';
import { TicketAdditionalDetailsComponent } from '../Helpdesk/Process/TicketAddtionalDetails/TicketAdditionalDetails';
import { DashboardComponent } from '../Helpdesk/Process/Dashboard/Dashboard';
import { SearchComponent } from '../Helpdesk/Process/Search/Search';
import { RegistrationDeptComponent } from '../Helpdesk/Process/RegistrationDept/RegistrationDept';
import { TicketRegistrationComponent } from './Process/Ticket Registration/TicketRegistration';
import { WeekendholidaystaffComponent } from './Process/WeekendHolidayStaff/weekendholidaystaff.component';
import { Guards } from '../Global/Auth.Guard';
const helpdeskroutes: Routes = [
  {
    path: '', component: HelpdeskComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'HelpDesk/Process', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'sample', component: SampleComponent },
      { path: 'ticketdetails/:Ticketid/:TicketMode', component: TicketDetailsComponent, data: { breadcrumb: 'ticketdetails' } },
      { path: 'ticketadditionaldetails', component: TicketAdditionalDetailsComponent, data: { breadcrumb: 'ticketdetails' } },
      { path: 'Dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'search', component: SearchComponent, data: { breadcrumb: 'Ticket Search' } },
      { path: 'Registration', component: RegistrationDeptComponent, data: { breadcrumb: 'Registration' } },
	    { path: 'RegistrationDtl/:DeptId', component: TicketRegistrationComponent, data: { breadcrumb: 'Ticket Registration' } },
      { path: 'Weekendholidaystaff', component: WeekendholidaystaffComponent, data: { breadcrumb: 'Weekend Holiday Staff' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(helpdeskroutes)],
  exports: [RouterModule]
})
export class helpdeskrouting {

}
