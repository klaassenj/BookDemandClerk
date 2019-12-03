import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchType, BookService } from 'src/app/services/book.service';
import { RankingService, Ranking } from 'src/app/services/ranking.service';
import { User, LoginService } from '../services/login.service';

export interface Book {
  isbn: string,
  info: string,
  title: string,
  description: string,
  authors: string,
  reviews: string,
  expanded: boolean,
  buttonColor1: String,
  buttonColor2: String,
  buttonColor3: String,
  value: number
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  results = '';
  valid = false;
  notSubmitted = true;
  books: any[]= [{
        // intro to optics
        isbn: 'isbn:9780131499331',
        info: '',
        title: '',
        description: '',
        authors: '',
        reviews: 'https://www.amazon.com/Introduction-Optics-3rd-Frank-Pedrotti/dp/0131499335#customerReviews',
        expanded: false,
        buttonColor1: 'light',
        buttonColor2: 'light',
        buttonColor3: 'light',
        value: 0
      },
      {
        // shaping digital world
        isbn: 'isbn:9780830827138',
        info: '',
        title: '',
        description: '',
        authors: '',
        reviews: 'https://www.amazon.com/Shaping-Digital-World-Computer-Technology/dp/0830827137#customerReviews',
        expanded: false,
        buttonColor1: 'light',
        buttonColor2: 'light',
        buttonColor3: 'light',
        value: 0
      },
        {
        // stats
        isbn: 'isbn:9780470601877',
        info: '',
        title: '',
        description: '',
        authors: '',
        reviews: 'https://www.amazon.com/Statistics-Binder-Ready-Version-Unlocking/dp/1118583108#customerReviews',
        expanded: false,
        buttonColor1: 'light',
        buttonColor2: 'light',
        buttonColor3: 'light',
        value: 0
      },
      {
        // linear algebra
        isbn: 'isbn:9781429215213',
        info: '',
        title: '',
        description: '',
        authors: '',
        reviews: 'https://www.amazon.com/Linear-Algebra-Geometric-Ted-Shifrin/dp/1429215216#customerReviews',
        expanded: false,
        buttonColor1: 'light',
        buttonColor2: 'light',
        buttonColor3: 'light',
        value: 0
      }
      ];

  itemExpandHeight: number = 250;

  type: SearchType = SearchType.isbn;
  result: Observable<any>;
  user : User;

  constructor(private bookService: BookService, private rankingService: RankingService, private loginService : LoginService) {

    for (let i = 0; i < this.books.length; i++) {
      this.books[i].title = this.bookService.getObservable(this.books[i].isbn).subscribe(
        data =>{
          // populate the titles
          this.books[i].title = data[0].volumeInfo.title;
          // populate the descriptions
          this.books[i].description = data[0].volumeInfo.description;
          // populate the authors
          this.books[i].authors = data[0].volumeInfo.authors;
      });
    }
    this.user = this.loginService.getUser();
  }

  expandItem(item) {
      for(let i = 0; i < this.books.length; i++) {
        if (this.books[i].expanded === true && this.books[i] !== item) {
          this.books[i].expanded = false;
        }
      }
      item.expanded = !item.expanded;
  }

  voteButtonClicked(buttonNumber: number, book) {
    if (buttonNumber === 1) {
      if (book.buttonColor1 !== 'primary') {
        book.buttonColor1 = 'primary';
        book.buttonColor2 = 'light';
        book.buttonColor3 = 'light';
        book.value = 1;
      }
    } else if (buttonNumber === 2) {
      if (book.buttonColor2 !== 'primary') {
        book.buttonColor1 = 'light';
        book.buttonColor2 = 'primary';
        book.buttonColor3 = 'light';
        book.value = 2;
      }
    } else if (buttonNumber === 3) {
      if (book.buttonColor3 !== 'primary') {
        book.buttonColor1 = 'light';
        book.buttonColor2 = 'light';
        book.buttonColor3 = 'primary';
        book.value = 3;
      }
    }
  }

  submitButton() {
    this.valid = true;
    // for (let i = 0; i < this.books.length; i++) {
    //   if (this.books[i].value === 0) {
    //     this.valid = false;
    //   }
    // }

    // if (!this.valid) {
    //   this.results = '';
    //   alert('Please rate all books.');
    // } else {
    //   // do nothing
    // }
    
    // Set Ranking
    console.log(this.books)
    console.log()
    this.books.forEach(book => {
      let ranking = this.createRanking(book);
      console.log(ranking);
      this.rankingService.addRanking(ranking)
    });

    this.notSubmitted = false;

    // let know that it was successful
    alert('Successfully Submitted!');
    
  }

  createRanking(book : Book) {
    let ranks = { bookISBN : book.isbn, bookTitle : book.title, score : book.value };
    let user = this.loginService.getUser();
    let ranking : Ranking = Object.assign(ranks, user);
    return ranking;
  }

}