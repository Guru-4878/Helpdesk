import { Component, OnInit } from '@angular/core';
import { GlobalUtils } from '../../../Global/Globalvariables'
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.html',
})
export class Logout implements OnInit {
  constructor(private global: GlobalUtils, private readonly route: Router) {
    this.global.logout();
    window.location.href = global.RedirectLogout();
  }
  ngOnInit() {
  }

}
