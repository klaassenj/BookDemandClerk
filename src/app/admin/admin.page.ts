import { Component, OnInit } from '@angular/core';
import { RankingService, Ranking, RankingProps } from '../services/ranking.service';
import { Observable, Observer, throwError } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Book } from '../home/home.page'
import { BookService } from '../services/book.service'
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
  public books : Book[];


  integratedData : boolean = true;
  rankings: Ranking[];
  switchLabel : String = "View Raw Data";
  
  constructor(private rankingService: RankingService, 
              private bookService : BookService, 
              private http: HttpClient, 
              private router: Router) {
    
    this.loadRankings();
    this.constructBookDataTable();
    this.loadBooks();
    
    
    // let sendEmail = firebase.functions().httpsCallable('sendWelcomeEmail')
    // sendEmail({email:"bookdemandclerk@gmail.com", displayName:"Books" }).then(() =>{
    //   console.log("Email sent!");
    // })
  }

  ngOnInit() {
  }

  loadRankings() {
    console.log("Loading Rankings...")
      this.rankingService.getRankings().subscribe((rankings) => {
          this.rankings = rankings
          console.log("Rankings Loaded. ");
          console.log(this.rankings);
          this.constructCompiledDataTable();
      });
      
  }

  loadBooks() {
    this.books = this.bookService.getBooks()
    console.log("Books Loaded.")
    console.log(this.books)
  }

  constructBookDataTable() {
    this.bookColumns = [
      { prop: 'isbn', name: 'ISBN Number' },
      { prop: 'title', name: 'Title' },
      { prop: 'author', name: 'Author' },
      { prop: 'department', name: "Department" },
      { prop: 'reviews', name: "Review Page" },
    ];
      this.books = this.bookService.getBooks()
      let keys : string[] = this.bookColumns.map(element => {
        return element.prop.toString()
      });
      this.bookRows = this.books.map(book => {
        let columnObject = {}
        keys.forEach(key => {
          columnObject[key] = book[key]
        });
        return columnObject
      });
  }

  constructCompiledDataTable() {
    this.columns = [
      { prop: 'title', name: 'Title' },
      { prop: 'avgrating', name: 'Average Rating' },
      { prop: 'numOnes', name: "Number of 1's" },
      { prop: 'numTwos', name: "Number of 2's" },
      { prop: 'sum', name: 'Number of 3\'s'},
      { prop: 'total', name: "Total # of Ratings"}
    ];
      let uniqueTitles = this.getUniqueTitles(this.rankings);
      this.rows = uniqueTitles.map(bookTitle => {
        return {
          title : bookTitle,
          avgrating : this.calculateAverageRatingPerTitle(this.rankings, bookTitle),
          numOnes : this.calculateSumPerScore(this.rankings, bookTitle, 1),
          numTwos : this.calculateSumPerScore(this.rankings, bookTitle, 2),
          sum : this.calculateSumPerScore(this.rankings, bookTitle, 3),
          total : this.calculateTotal(this.rankings, bookTitle)
        }
      });
  }

  constructRawDataTable() {
    let dummyRanking = new RankingProps();
    this.columns = Object.keys(dummyRanking).map(key => {
      return { prop: key, name: key }
    }).filter(col => col.prop != "id");
    this.rows = this.rankings;
  }

  switchTable() {
    this.integratedData = !this.integratedData
    this.switchLabel = this.integratedData ? "View Raw Data" : "View Compiled Data";
    if(this.integratedData) {
      this.constructCompiledDataTable();
    } else {
      this.constructRawDataTable();
    }
  }

  getUniqueTitles(rankings : Ranking[]) {
    let titles = [];
    rankings.forEach(ranking => {
      if(!titles.includes(ranking.bookTitle)) {
        titles.push(ranking.bookTitle);
      }
    });
    return titles;
  }

  calculateTotal(rankings : Ranking[], title : String) {
    return rankings.filter(ranking => ranking.bookTitle == title).length
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

}
