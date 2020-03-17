import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface User {
  firstName: string,
  lastName : string,
  department : string,
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user : User;

  constructor() { 
    this.user = {
      firstName: "",
      lastName: "",
      department: ""
    }
  }

  login(ngForm : NgForm) {
    this.user.firstName = ngForm.form.value["First Name"];
    this.user.lastName = ngForm.form.value["Last Name"];
    this.user.department = ngForm.form.value["Department"];
    //console.log(this.user);
  }

  getDeparment() {
    return this.user.department;
  }


  getUser() : User {
    return this.user;
  }
}
