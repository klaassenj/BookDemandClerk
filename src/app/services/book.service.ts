import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export enum SearchType {
  isbn = '',
  name = ''
}

interface BookTitle {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url = 'https://www.googleapis.com/books/v1/volumes';
  key = 'AIzaSyAE-sRoOWCEaZWNwfI06Bc7Dtm1BcqYC2k';
  books = [];

  constructor(private http: HttpClient) { }

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
      console.log("Title is: " + data[0].volumeInfo.title);
      result = "Book Title";//String(data[0].volumeInfo.title);
      //String(data[0].volumeInfo.title);
    });
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
}
