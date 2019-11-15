import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export enum SearchType {
  isbn = '',
  name = ''
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url = 'https://www.googleapis.com/books/v1/volumes';
  key = 'AIzaSyAE-sRoOWCEaZWNwfI06Bc7Dtm1BcqYC2k';

  constructor(private http: HttpClient) { }

  searchData(search: string, type: SearchType): Observable<any> {
    if (search !== '') {
      return this.http.get(`${this.url}?q=${encodeURI(search)}&apikey=${this.key}`).pipe(
        map(results => results['items.volumeInfo'])
      );
    }
  }

  getDetails(id) {
    return this.http.get(`${this.url}?i=${id}&plot=full&apikey${this.key}`);
  }

   getTitle(isbn: string) {
      return this.http.get(`${this.url}?q=${encodeURI(isbn)}&apikey=${this.key}`)
        .map((volume) => volume.title )
        .subscribe()
      );
    }
}
