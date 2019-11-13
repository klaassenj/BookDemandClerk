import { Component } from '@angular/core';

interface Item {
  title : string,
  author : String,
  description : string,
  expanded : boolean   
 }

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  
  private title: String;
  private buttonText: String;
  public items: Item[] = [];
  constructor() {
    this.title = "Welcome to the Book Demand Clerk"
    this.buttonText = "Open Menu"
    this.items = [
      
      { 
        title: "Foundations and Applications of Statistics",
        author: "Prof. Randall Pruim",
        description: "Exploring the methods and use cases of statistical calculations.",
        expanded: false 
      },
      { 
        title: "Computer Networks and Internets",
        author: "Douglas E. Comer",
        description: "Describing the structure and protocols of interhost communication.",
        expanded: false 
      },
      { 
        title: "Boys in the Boat",
        author: "Daniel James Brown",
        description: "The Story of the 1936 U.S. Olympic Rowing team and their long road to victory.",
        expanded: false 
      },
      { 
        title: "Gregor and the Underworld",
        author: "Suzanne Collins",
        description: "A kid sets off on a journey to an unknown world.",
        expanded: false 
      },
      { 
        title: "Tunnels",
        author: "Roderick Gordon",
        description: "Eccentric Scientist finds underground society.",
        expanded: false 
      }
    ];
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }
}
