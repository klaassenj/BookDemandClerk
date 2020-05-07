import { Component, OnInit } from '@angular/core';
import { RankingService, Ranking, RankingProps } from '../services/ranking.service';
import { Observable, Observer, throwError } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Book } from '../home/home.page'
import { BookService, BookDB } from '../services/book.service'
import { catchError, retry, map } from 'rxjs/operators';

export interface Column {
  prop: String,
  name: String
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminPage implements OnInit {
  public columns: Column[];
  public rows: any;

  public bookColumns: Column[];
  public bookRows: any;
  public books : BookDB[];


  integratedData : boolean = true;
  rankings: Ranking[];
  switchLabel : String = "View Raw Data";
  
  constructor(private rankingService: RankingService, 
              private bookService : BookService, 
              private http: HttpClient, 
              private router: Router) {
    
    this.loadRankings();
    this.loadBooks();
    
    // let sendEmail = firebase.functions().httpsCallable('sendWelcomeEmail')
    // sendEmail({email:"bookdemandclerk@gmail.com", displayName:"Books" }).then(() =>{
    //   console.log("Email sent!");
    // })
  }

  ngOnInit() {
  }

  loadRankings() {
    //console.log('Loading Rankings...')
    this.rankingService.getRankings().subscribe((rankings) => {
      this.rankings = rankings
      //console.log('Rankings Loaded. ');
      //console.log(this.rankings);
      this.constructCompiledDataTable();
    });
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(books => {
      this.books = books
      //console.log('Books Loaded.')
      //console.log(this.books)
      this.constructBookDataTable();
    });
  }

  constructBookDataTable() {
    this.bookColumns = [
      { prop: 'isbn', name: 'ISBN Number' },
      { prop: 'title', name: 'Title' },
      { prop: 'author', name: 'Author(s)' },
      { prop: 'department', name: 'Department' }, 
      { prop: 'reviewPage', name: 'Review Page' },
    ];
    let keys : string[] = this.bookColumns.map(element => {
      return element.prop.toString();
    });
    this.bookRows = this.books.map(book => {
      const columnObject = {};
      console.log("Book is admin.page.ts")
      console.log(book)
      columnObject['isbn'] = book.isbn;
      columnObject['department'] = book.department;
      columnObject['reviewPage'] = book.reviewPage;
      columnObject['title'] = this.bookService.getBookTitle(book.isbn);
      columnObject['author'] = this.bookService.getBookAuthors(book.isbn);
      console.log('Data Row After assignment');
      console.log(columnObject);
      return columnObject;
    });
  }

  constructCompiledDataTable() {
    this.columns = [
      { prop: 'isbn', name: 'ISBN' },
      { prop: 'title', name: 'Title' },
      { prop: 'publisher', name: "Publisher" },
      { prop: 'toprating', name: "Top Rating" },
      { prop: 'ebook', name: "eBook Okay"},
      { prop: 'total', name: "Total # of Ratings"}
    ];
    const uniqueISBNs = this.getUniqueISBNS(this.rankings);
    const aggregateRankings = uniqueISBNs.map(ISBN => {
      return {
              isbn: ISBN, 
              title: this.rankings.find(ranking => ranking.bookISBN == ISBN).bookTitle
      };
    });
    this.rows = aggregateRankings.map(aggrRanking => {
      console.log("Unqiue ISBN Ranking Aggregate with ISBN and title")
      console.log(aggrRanking)
      return {
        isbn : aggrRanking.isbn,
        title : aggrRanking.title,
        publisher : this.bookService.getPublisher(aggrRanking.isbn), //TODO
        toprating : this.getTopRating(this.rankings, aggrRanking.isbn),
        ebook : this.geteBookConsensus(aggrRanking.isbn),
        total : this.calculateTotal(this.rankings, aggrRanking.isbn)
      }
    });
  }

  constructRawDataTable() {
    const dummyRanking = new RankingProps();
    this.columns = Object.keys(dummyRanking).map(key => {
      return { prop: key, name: key }
    }).filter(col => col.prop !== 'id');
    this.rows = this.rankings;
  }

  switchTable() {
    this.integratedData = !this.integratedData;
    this.switchLabel = this.integratedData ? 'View Raw Data' : 'View Compiled Data';
    if(this.integratedData) {
      this.constructCompiledDataTable();
    } else {
      this.constructRawDataTable();
    }
  }

  geteBookConsensus(isbn : string) {
    return undefined === this.rankings
            .filter(ranking => ranking.bookISBN == isbn)
            .find(ranking => !ranking.eBook)
  }

  getUniqueTitles(rankings: Ranking[]) {
    let titles = [];
    rankings.forEach(ranking => {
      if(!titles.includes(ranking.bookTitle)) {
        titles.push(ranking.bookTitle);
      }
    });
    return titles;
  }

  getUniqueISBNS(rankings: Ranking[]) {
    let isbns = [];
    rankings.forEach(ranking => {
      if(!isbns.includes(ranking.bookISBN)) {
        isbns.push(ranking.bookISBN);
      }
    });
    return isbns;
  }

  calculateTotal(rankings : Ranking[], isbn : String) {
    return rankings.filter(ranking => ranking.bookISBN == isbn).length
  }

  calculateAverageRatingPerTitle(rankings : Ranking[], title : String) : String {
    let allRatingsForThisTitle = rankings.filter(ranking => ranking.bookTitle == title); // Only ratings with this title
    return allRatingsForThisTitle.reduce((total, ranking) => total + ranking.score / allRatingsForThisTitle.length, 0).toFixed(2); // Average those ratings
  }

  calculatePercentagePerScore(rankings : Ranking[], title : String, score : number) {
    let scoreFilteredList = rankings.filter(ranking => { // Only ratings with a certain score and title
      return ranking.score == score && ranking.bookTitle == title; 
    });
    let allRatingsForThisTitle = rankings.filter(ranking => ranking.bookTitle == title);
    return (scoreFilteredList.length / allRatingsForThisTitle.length * 100).toFixed(1)  + "%" // Number out of 100 of the total number of ratings for that title
  }

  calculateSumPerScore(rankings : Ranking[], title : String, score : number) {
    let scoreFilteredList = rankings.filter(ranking => { // Only ratings with a certain score and title
      return ranking.score == score && ranking.bookTitle == title; 
    });
    return scoreFilteredList.length;
  }

  uploadBooksPage() {
    this.router.navigateByUrl('uploadbooks');
  }

  getTopRating(rankings : Ranking[], isbn : string) {
      let min = 3
      rankings.forEach(ranking => {
        if(ranking.bookISBN == isbn) {
          if(ranking.score < min) {
            min = ranking.score
            if(min == 1) {
              return min
            }
          }
        }
      });
      return min
  }

}
