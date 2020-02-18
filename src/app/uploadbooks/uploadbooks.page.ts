import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-uploadbooks',
  templateUrl: './uploadbooks.page.html',
  styleUrls: ['./uploadbooks.page.scss'],
})
export class UploadbooksPage implements OnInit {

  // needed variables
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(private http: HttpClient, private papa: Papa) {
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
    let csv = this.papa.unparse({
      data: this.csvData
    });
    console.log('csv: ', csv);
  }

}
