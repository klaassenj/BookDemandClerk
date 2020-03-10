import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { Book } from '../interfaces/book';
import { UploadServiceService } from '../services/upload-service.service';


@Component({
  selector: 'app-uploadbooks',
  templateUrl: './uploadbooks.page.html',
  styleUrls: ['./uploadbooks.page.scss'],
})
export class UploadbooksPage implements OnInit {

  // needed variables
  csvData: any[] = [];
  headerRow: any[] = [];
  department = 'Select Department';

  constructor(private http: HttpClient, private papa: Papa, private uploadService: UploadServiceService) {
    this.loadCSV();
  }

  ngOnInit() {
  }

  private loadCSV() {
    this.http.get('./assets/books.csv', {
      responseType: 'text'
    }).subscribe(
      data => this.extractData(data),
      err => console.log('error: ', err)
    );
  }

  extractData(res) {
    const csvData = res || '';

    this.papa.parse(csvData, {
      complete: parsedData => {
        this.headerRow = parsedData.data.splice(0, 1)[0];
        this.csvData = parsedData.data;
      }
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  uploadBooks() {

    if (this.department !== 'Select Department') {

      const csv = this.papa.unparse({
        data: this.csvData
      });
      const totalEntries = csv.split(/[\n,]+/);
      const parsedEntries: string[] = [];

      for (let i = 0; i < totalEntries.length; i++) {
        // get rid of the empty entries
        if (totalEntries[i].length > 1) {
          parsedEntries.push(totalEntries[i]);
        }
      }

      // loop trough the actual entries and add them to the database
      if (parsedEntries.length % 2 === 0) {
        const list: Book[] = [];
        for (let i = 0; i < parsedEntries.length / 2; i++) {
          const isbnIndex = 2 * i; // the even entries
          const reviewIndex = 2 * i + 1; // the odd entries
          // store the isbn and review link in book object
          const newBook: Book = { ISBN: parsedEntries[isbnIndex], reviewPage: parsedEntries[reviewIndex]};
          list.push(newBook);
        }
        this.uploadService.upload(list, this.department);
      }
    } else {
      alert('Please select a department');
    }

  }

}
