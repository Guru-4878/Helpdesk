import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserProfile } from '../Global/UserProfile';
import { CasDetails } from '../Models/CAS/cas-details';
import { ToastrService } from 'ngx-toastr';
//import * as CryptoJS from 'crypto-js';  
@Injectable({
  providedIn: 'root'
})
export class GlobalUtils {
  constructor(private BrowserTitle: Title, private userprofile: UserProfile, private Toatser: ToastrService) { }
  public static getSiteCollectionUrl(): string {
    if (window
      && "location" in window
      && "protocol" in window.location
      && "pathname" in window.location
      && "host" in window.location) {
      let baseUrl = window.location.protocol + "//" + window.location.host;
      const pathname = window.location.pathname;
      const siteCollectionDetector = "/sites/";
      if (pathname.indexOf(siteCollectionDetector) >= 0) {
        baseUrl += pathname.substring(0, pathname.indexOf("/", siteCollectionDetector.length));
      }
      return baseUrl;
    }
    return null;
  }
  public static getCurrentAbsoluteSiteUrl(): string {
    if (window
      && "location" in window
      && "protocol" in window.location
      && "pathname" in window.location
      && "host" in window.location) {
      return window.location.protocol + "//" + window.location.host + window.location.pathname;
    }
    return null;
  }
  public static getWebServerRelativeUrl(): string {
    if (window
      && "location" in window
      && "pathname" in window.location) {
      return window.location.pathname.replace(/\/$/, "");
    }
    return null;
  }
  public static getLayoutsPageUrl(libraryName: string): string {
    if (window
      && "location" in window
      && "pathname" in window.location
      && libraryName !== "") {
      return window.location.pathname.replace(/\/$/, "") + "/_layouts/15/" + libraryName;
    }
    return null;
  }
  public static getAbsoluteDomainUrl(): string {
    if (window
      && "location" in window
      && "protocol" in window.location
      && "host" in window.location) {
      return window.location.protocol + "//" + window.location.host;
    }
    return null;
  }
  public getBaseUrl(): string {
    return document.getElementsByTagName('base')[0].href;

  }
  public RedirectLogin(): string {
    return this.getBaseUrl() + "login?returnUrl=" + this.getBaseUrl() + "#/auth/warning";

  }
  public RedirectLogout(): string {
    return this.getBaseUrl() + "logout";

  }
  SuccessMsg(MSG: any) {
    this.Toatser.success(MSG);
  }
  ErrorMsg(MSG: any) {
    this.Toatser.error(MSG);
  }
  //Guard
  //Guru Murthy
  isAuthorized() {
    let profile = this.userprofile.getProfile();
    var validToken = window.localStorage.getItem('EmployeeCode') != "" && window.localStorage.getItem('EmployeeCode')!= null;
    return validToken //&& !isTokenExpired TRUE OR FALSE
    //let profilel: CasDetails = JSON.parse(this.userprofile.get_userdetails());
    //if (profilel != null) {
    //  var validToken = profilel.EmployeeCode != "" && profilel.EmployeeCode != null;
    //  return validToken //&& !isTokenExpired TRUE OR FALSE
    //} else
    //  return false;
  }
  logout(): void {
    this.userprofile.resetProfile();
  }
  //EnCript_DeCript_PassWord: string = "HELPDESK";
  //EncriptTicketId(Anything): string {
  //  return CryptoJS.AES.encrypt(Anything.trim(), this.EnCript_DeCript_PassWord.trim()).toString();
  //}
  //DecriptTicketId(Anything): string {
  //  return CryptoJS.AES.decrypt(Anything.trim(), this.EnCript_DeCript_PassWord.trim()).toString(CryptoJS.enc.Utf8);  
  //}
}

