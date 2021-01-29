import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CasDetails } from '../Models/CAS/cas-details'
@Injectable()
export class UserProfile {
  userProfile: CasDetails
  //= {
  //  EmployeeCode: "",
  //  EmployeeName: "",
  //  DeptCode: "",
  //  DeptName: "",
  //  GradeID: "",
  //  GradeName: "",
  //  ProjectID: "",
  //  ProjectName: "",
  //  SecondaryProjects: ""
  //};

  constructor(private router: Router) {
    this.userProfile = <CasDetails>{};
    this.userProfile.EmployeeCode = "",
      this.userProfile.EmployeeName = "",
      this.userProfile.DeptCode = "",
      this.userProfile.DeptName = "",
      this.userProfile.GradeID = "",
      this.userProfile.GradeName = "",
      this.userProfile.ProjectID = "",
      this.userProfile.ProjectName = "",
      this.userProfile.SecondaryProjects = ""
  }
  setProfile(profile: CasDetails): void {
    window.localStorage.setItem('EmployeeCode', profile.EmployeeCode);
    window.localStorage.setItem('EmployeeName', profile.EmployeeName);
    window.localStorage.setItem('DeptCode', profile.DeptCode);
    window.localStorage.setItem('DeptName', profile.DeptName);
    window.localStorage.setItem('GradeID', profile.GradeID);
    window.localStorage.setItem('GradeName', profile.GradeName);
    window.localStorage.setItem('ProjectID', profile.ProjectID);
    window.localStorage.setItem('ProjectName', profile.ProjectName);
    window.localStorage.setItem('SecondaryProjects', profile.SecondaryProjects);
    localStorage.setItem("Local", JSON.stringify(profile));
  }

  getProfile(): CasDetails {

    this.userProfile.EmployeeCode = window.localStorage.getItem('EmployeeCode');
    this.userProfile.EmployeeName = window.localStorage.getItem('EmployeeName');
    this.userProfile.GradeID =      window.localStorage.getItem('GradeID');
    this.userProfile.GradeName =    window.localStorage.getItem('GradeName');
    this.userProfile.DeptName =     window.localStorage.getItem('DeptName');
    this.userProfile.DeptCode =     window.localStorage.getItem('DeptCode');
    this.userProfile.ProjectID = window.localStorage.getItem('ProjectID');
    this.userProfile.SecondaryProjects = window.localStorage.getItem('SecondaryProjects');
    this.userProfile.ProjectName = window.localStorage.getItem('ProjectName');
    return this.userProfile;
  }
  get_userdetails(): string {
    return localStorage.getItem("Local");
  }
  userdetails(): CasDetails {
    this.userProfile = JSON.parse(this.get_userdetails());
    return this.userProfile
  }

  resetProfile(): CasDetails {
    localStorage.removeItem("Local");
    window.localStorage.removeItem('EmployeeCode');
    window.localStorage.removeItem('EmployeeName');
    this.userProfile = {
      EmployeeCode: "",
      EmployeeName: "",
      SecondaryProjects: "",
      ProjectName: "",
      DeptCode: "",
      GradeName: "",
      GradeID: "",
      DeptName: "",
      ProjectID: ""
    };
    return this.userProfile;
  }
}
