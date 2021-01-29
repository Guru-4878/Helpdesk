import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { WarningComponent } from './warning/warning.component';
import { Logout } from '../Auth/logout/Logout';
import { Guards } from '../../Global/Auth.Guard';
import { ChangeUserComponent } from '../Auth/changeuser/changeuser';
import { SharedModule } from '../../Shared/Shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,

    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'warning',
        component: WarningComponent
      },
      {
        path: 'change',
        component: ChangeUserComponent
      },
      {
        path: 'logout',
        // canActivate: [Guards],
        component: Logout
      },
     
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, AuthComponent, WarningComponent, Logout, ChangeUserComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    SharedModule, FormsModule, ReactiveFormsModule
  ]
})
export class AuthModule { }
