import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { Book } from '../interfaces/book';
import { UploadServiceService } from '../services/upload-service.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { NgControlStatus } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { formatPercent } from '@angular/common';


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
  returnPath: string;
  fileData: any;
  uploader: FileUploader = new FileUploader({});
  reader: FileReader = new FileReader();
  rawFileText: any;

  constructor(private http: HttpClient,
              private papa: Papa,
              private uploadService: UploadServiceService,
              private filePath: FilePath,
              private fileChooser: FileChooser,
              /*private fileUploader: FileUploader,
              private fileLikeObject: FileLikeObject*/) {
    // call loadCSV()
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

  loadFileData() {
    // callback for when the onload function is triggered
    this.reader.onload = (e) => {
      // get the result and store it in the rawFileText variable
      const resultString: string = this.reader.result as string;
      this.rawFileText = resultString;
      // call the parse function
      this.parseFileData();
    };
    // get the list of the files (most likely just one)
    this.fileData = this.getFiles();
    // read the file as text
    this.reader.readAsText(this.fileData[0].rawFile);
  }

  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  parseFileData() {
    let parsedArray: string[] = [];
    let isbnArray: string[] = [];
    // split the .csv string by commas and empty space
    const totalEntries = this.rawFileText.split(/[\n,]+/);
    // parse out isbn and choice review numbers
    parsedArray = this.firstParse();
    // get the isbn numbers from the first parse
    isbnArray = this.parseISBN(parsedArray);
    // send the books to the database
    this.sendBooks(isbnArray);
  }

  // function to parse out probable isbn and choice review numbers
  firstParse(): string[] {
    const parsedArray: string[] = [];
    const totalEntries = this.rawFileText.split(/[\n,]+/);

    // get rid of header info
    totalEntries.splice(0, 10);
    console.log(totalEntries);

    // each entry has 10 columns:
    // Title, Subtitle, Edition, Author, RespState, Publisher, LC Class Number, ISBN, URL, Choice Review Number
    // all of the isbns start with a 9
    totalEntries.forEach(entry => {
      // check that the entry is an isbn number
      if (String(entry).includes('9') && entry.length >= 13 && entry.length < 16) {
        parsedArray.push(entry);
      } else if (entry.includes('-') && entry.length === 8) {
        parsedArray.push(entry);
      }
    });

    return parsedArray;
  }

  // function to finally parse out the ISBN numbers from the .csv
  parseISBN(input: string[]): string[] {
    let isbnArray: string[] = [];
    // the first value should be an isbn number; add it to the list
    isbnArray.push(input[0]);
    // loop through the parseArray and take only one isbn per book
    for (let i = 1; i < input.length; ++i) {
      // look for entries that are a Choice Review Number and then take the next entry after that (an isbn)
      if (input[i].includes('-')) {
        if ((i + 1) < input.length) {
          isbnArray.push(input[i + 1].replace('"', ''));
        }
      }
    }
    return isbnArray;
  }

  sendBooks(infoArray: string[]) {
    if (this.department !== 'Select Department') {
      const bookList: Book[] = [];
      for (let i = 0; i < infoArray.length; i++) {
        // store the isbn and review link in book object
        const newBook: Book = { ISBN: infoArray[i].replace('"', ''), reviewPage: 'null'};
        bookList.push(newBook);
      }
      this.uploadService.upload(bookList, this.department);
    } else {
      alert('Please Select Department');
    }
  }

}
