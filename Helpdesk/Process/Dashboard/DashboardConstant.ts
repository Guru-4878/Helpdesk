import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DashboardConstant {
  constructor(private httpClient: HttpClient) {

  }
  binddashboard = 'api/Dashboard/getDashboardTickets';
  

}
