import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { DashBoardConstants } from '../Dashboard/dashboardConstants';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SharedModule } from '../../Shared/Shared.module';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [DashBoardConstants]
})
export class DashboardModule { }
