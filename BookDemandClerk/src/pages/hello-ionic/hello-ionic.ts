import { Component } from '@angular/core';



@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  private title : String;
  private buttonText : String;
  constructor() {
    this.title = "Welcome to the Book Demand Clerk"
    this.buttonText = "Open Menu"
  }
}
