import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchType, BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  books: any = [];
  //itemExpanded: boolean = true;
  itemExpandHeight: number = 200;

  type: SearchType = SearchType.isbn;
  result: Observable<any>;


  constructor(private bookService: BookService) {


    this.books = [
      {
        // intro to optics
        isbn: 'isbn:9780131499331',
        info: this.bookService.searchData('isbn:9780131499331', this.type),
        title: '',
        description: '',
        reviews: '',
        expanded: false
      },
      {
        // stats
        isbn: 'isbn:9780470601877',
        info: this.bookService.searchData('isbn:9780470601877', this.type),
        title: '',
        description: '',
        reviews: '',
        expanded: false
      },
      {
        // shaping digital world
        isbn: 'isbn:9780830827138',
        info: this.bookService.searchData('isbn:9780830827138', this.type),
        title: '',
        description: '',
        reviews: '',
        expanded: false
      },
      {
        // comp architecture
        isbn: 'isbn:9781284123036',
        info: this.bookService.searchData('isbn:9781284123036', this.type),
        title: '',
        description: '',
        reviews: '',
        expanded: false
      },
      {
        // linear algebra
        isbn: 'isbn:9781429215213',
        info: this.bookService.searchData('isbn:9781429215213', this.type),
        title: '',
        description: '',
        reviews: '',
        expanded: false
      },
    ];
    this.result = this.bookService.searchData(this.books[0].isbn, this.type);
    console.log(this.result);
    //console.log(this.bookService.getTitle(this.books[0].isbn));
    // this.books[0].title = this.result[0].title;
    // this.books[0].description = this.result[0].description;
    // this.result = this.bookService.searchData(this.books[1].isbn, this.type);
    // this.books[1].title = this.result[1].title;
    // this.books[1].description = this.result[1].description;

    // this.result = this.bookService.searchData(this.books[2].isbn, this.type);
    // this.books[2].title = this.result[2].title;
    // this.books[2].description = this.result[2].description;

    // this.result = this.bookService.searchData(this.books[3].isbn, this.type);
    // this.books[3].title = this.result[3].title;
    // this.books[3].description = this.result[3].description;

    // this.result = this.bookService.searchData(this.books[4].isbn, this.type);
    // this.books[4].title = this.result[4].title;
    // this.books[4].description = this.result[4].description;
  }

  expandItem(item) {
      for(let i = 0; i < this.books.length; i++) {
        if (this.books[i].expanded === true && this.books[i] !== item) {
          this.books[i].expanded = false;
        }
      }
      item.expanded = !item.expanded;
  }

}
