import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface User {
  userID: string,
  department : string,
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user : User;

  constructor() { 
    this.user = {
      userID: "",
      department: ""
    }
  }

  login(ngForm : NgForm) {
    this.user.userID = ngForm.form.value["userID"];
    this.user.department = ngForm.form.value["Department"];
    console.log("User from login service")
    console.log(this.user);
  }

  getDeparment() {
    return this.user.department;
  }


  getUser() : User {
    console.log("User from getUser() in login service")
    console.log(this.user)
    return this.user;
  }
}
