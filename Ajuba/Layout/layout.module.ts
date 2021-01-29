import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from '../Layout/Breadcrumb/Breadcrumb';
import { CapitalizeFirstPipe } from '../../../AngularUi/src/app/CapitalizeFirstPipe';
@NgModule({
  declarations: [BaseComponent, NavbarComponent, SidebarComponent, FooterComponent, BreadcrumbComponent, CapitalizeFirstPipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    
  ]
})
export class LayoutModule {

}
