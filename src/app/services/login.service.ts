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

  }

  login(ngForm : NgForm) {
    this.user = ngForm.form.value;
    console.log(this.user);
  }

  getUser() : User {
    return this.user;
  }
}
