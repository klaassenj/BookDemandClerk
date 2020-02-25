import { Injectable } from '@angular/core';
import { Book } from '../interfaces/book';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  constructor(private afs: AngularFirestore) { }

  // function to upload a list of books to the database
  upload(booklist: Book[], currentDepartment: string) {
    // take all of the books and put them in the database
    
    // make all of the preious books archived
    this.getDepartmentBooks('Computer Science');

    const currentDate = new Date();
    for (let i = 0; i < booklist.length; i++) {
      this.afs.collection('books').add({
        isbn: booklist[i].ISBN,
        reviewPage: booklist[i].reviewPage,
        archived: false,
        department: currentDepartment,
        date: currentDate
      });
    }
    console.log('Added a new list of book...');
  }

  // get a collection of books
  getDepartmentBooks(listDepartment: string) {
    // const departmentBooks = this.afs.collection('/books', ref => ref.where('department', '==', listDepartment)).valueChanges().subscribe(
    //   data => console.log(data),
    //   data => data.forEach(element => {
    //     //this.afs.collection('books').doc().set()
    //   }));
    const departmentBooks = this.afs.collection('/books', ref => ref.where('department', '==', listDepartment)).snapshotChanges();
    departmentBooks.forEach(element => {
      console.log(element);
    });
      
    //console.log(departmentBooks);
  }
}
