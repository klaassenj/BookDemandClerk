import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {  throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

export enum SearchType {
  isbn = '',
  name = ''
}

interface BookTitle {
  title: string;
}

export interface BookDB {
  archived : boolean,
  date : Date,
  department : string,
  isbn : string,
  reviewPage : string
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksCollection: AngularFirestoreCollection<BookDB>;
  private booksArray : Observable<BookDB[]>;
  url = 'https://www.googleapis.com/books/v1/volumes';
  key = 'AIzaSyAE-sRoOWCEaZWNwfI06Bc7Dtm1BcqYC2k';
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

  constructor(private http: HttpClient, private db: AngularFirestore) {

    this.booksCollection = db.collection<BookDB>('books');
 
    this.booksArray = this.booksCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    console.log("Books Loaded")
    this.booksArray.subscribe(books => {
      console.log(books);
    })
   }

  getBookTitle(search: string) {
    // if (search !== '') {
    //   return this.http.get<string>(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
    //     map(results => results['items.volumeInfo'])
    //   );
    // }
    let result = '';
    this.http.get(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
    map(response => response['items']))
    .subscribe(data =>{
      console.log(data[0])
      if(data[0].volumeInfo.title === undefined) {
        result = "Not Found"
      } else { 
        console.log("Title is: " + data[0].volumeInfo.title);
        result = "Book Title";//String(data[0].volumeInfo.title);
      }
      //String(data[0].volumeInfo.title);
    });
    return result;
  }

  getBookAuthors(search : string) {
    let result = '';
    this.http.get(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
      map(response => response['items']))
      .subscribe(data =>{
        console.log(data[0])
        if(data[0].volumeInfo.authors === undefined) {
          result = "Not Found"
        } else { 
          console.log("Authors is: " + data[0].volumeInfo.authors.reduce((a,b) => a + b));
          result = "Authors";
        }
      });
    return result;
  }

  getBookDescription(search: string) {
    this.http.get(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
    map(response => response['items']))
    .subscribe(data =>{
      console.log("Description is: " + String(data[0].volumeInfo.description));
      return data[0].volumeInfo.description;
    });
  }

  getObservable(search: string) {
    return this.http.get(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
      retry(15),
      catchError(this.handleError),
      map(response => response['items'])
    );
  }

  // got this from https://www.techiediaries.com/angular-by-example-httpclient-get/
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getBooks() : Observable<BookDB[]> {
    this.booksArray = this.booksCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    console.log("Book Array")
    console.log(this.booksArray)
    return this.booksArray;
  }
}
