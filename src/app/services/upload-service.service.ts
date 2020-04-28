import { Injectable } from '@angular/core';
import { Book } from '../interfaces/book';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(private afs: AngularFirestore) { }

  // function to upload a list of books to the database
  async upload(booklist: Book[], currentDepartment: string) {
    // take all of the books and put them in the database

    // make all of the previous books archived
    this.archiveOldBooks(currentDepartment);
    // delay for a second so we don't overwrite the new list that's about to be written
    await this.delay(1000);

    const currentDate = new Date();
    for (let i = 0; i < booklist.length; i++) {
      this.afs.collection('books').add({
        isbn: booklist[i].ISBN,
        reviewPage: booklist[i].reviewPage,
        archived: false,
        department: currentDepartment,
        date: currentDate,
        title: booklist[i].title
      });
    }
  }

  // archive all books of the given department
  archiveOldBooks(listDepartment: string) {
    // get all of the books of the given department and archive them
    const books = this.afs.collection('/books', ref => ref.where('department', '==', listDepartment)).get().subscribe(
      book => {
        book.forEach(item => {
          this.afs.collection('books').doc(item.id).set({archived: true}, {merge: true});
        });
      });
  }

  // found this function to delay at: https://stackoverflow.com/questions/37764665/typescript-sleep
  // needed this so we can upload a new list of books, and archive the old books without accidentally archiving
  // the current books we just uploaded
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
