import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
//import { AuthService } from '../auth.service';
import { User, LoginService } from '../../services/login.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  default : User;
  fields : string[];

  constructor(private loginService : LoginService, private  router:  Router) {
    this.default = {
      firstName: "First Name",
      lastName: "Last Name",
      department: "Department",
    }
    this.fields = Object.keys(this.default);
   }

  ngOnInit() {
  }

  login(form : NgForm){
    this.loginService.login(form)
    this.router.navigateByUrl('home');
  }

  adminHandler() {
    this.router.navigateByUrl('admin');
  }

}