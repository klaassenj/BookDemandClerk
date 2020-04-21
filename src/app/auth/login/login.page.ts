import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginService } from '../../services/login.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  default: User;
  fields: string[];
  department: string;

  constructor(private loginService: LoginService, private  router: Router) {
    this.default = {
      userID: "aaa11@calvin.edu",
      department: 'Department',
      }
    this.fields = Object.keys(this.default);
   }

  ngOnInit() {
  }

  login(form: NgForm) {
    if(this.isValidUserID(form.form.value["userID"])) {
      this.loginService.login(form);
      this.router.navigateByUrl('home');
      console.log("login.page.ts login() Get User")
      console.log(this.loginService.getUser())
    } else {
      alert("Please enter a valid userID.")
    }
  }

  isValidUserID(userID : string) {
    console.log("isValidUserID")
    console.log(userID)
    return userID.match(/\b[\w\.-]+(@[\w\.-]+\.\w{2,4})*\b/g)
  }

  

  getDepartment() {
    return this.default.department;
  }
}
