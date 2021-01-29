import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalUtils } from '../../../Global/Globalvariables';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  returnUrl: any;

  constructor(private router: Router, private route: ActivatedRoute, private global: GlobalUtils) { }

  ngOnInit(): void {    
    if (this.global.isAuthorized() == true)
      // console.log(this.global.isAuthorized())
      this.router.navigate(['auth/warning']);
    else
      window.location.href = this.global.RedirectLogin();
  }



}
