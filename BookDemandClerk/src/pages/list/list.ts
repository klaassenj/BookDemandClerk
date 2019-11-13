import { OnInit, Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import * as $ from 'jquery/dist/jquery.min.js';

interface Item {
  title: string,
  author: String,
  description: string,
  expanded: boolean
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {

  items: Array<Item>;
  icon: string;
  pageTitle: string;

  ngOnInit() {
    var API_URL = "/api/books"
    $.ajax({
      url: API_URL,
      dataType: 'json',
      cache: true
    })
      .done(function (result) {
        console.log(result);
      }.bind(this))
      .fail(function (xhr, status, errorThrown) {
        console.error(API_URL, status, errorThrown.toString());
      }.bind(this));
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icon = "book";
    this.pageTitle = "Book Rating";
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

  loadBooks(): void {
    $.ajax({
      url: "/api/races",
      dataType: 'json',
      cache: true
    })
      .done(function (result) {
        if (!(result && result.length)) {
          this.setState({ emptyMessage: "There doesn't seem to be any races yet this season..." })
        }
        this.setState({ analysis: result });
        this.setState({ emptyMessage: "" });
      }.bind(this))
      .fail(function (xhr, status, errorThrown) {
        console.error("/api/races", status, errorThrown.toString());
        this.setState({ emptyMessage: "There was an error fetching the race data. Sorry. Check your internet settings, or submit a bug report." })
      }.bind(this));
  }
}
