import { Component, OnInit } from '@angular/core';
import { RankingService, Ranking, RankingProps } from '../services/ranking.service'
import { Observable, Observer } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface Data {
  movies: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminPage implements OnInit {
  public data: Data;
  public columns: any;
  public rows: any;

  integratedData : boolean = true;
  rankings: Ranking[];
  switchLabel : String = "View Raw Data";
  
  constructor(private rankingService : RankingService, private http : HttpClient) {
    this.loadRankings().then(() => {
      console.log("Rankings Loaded. ");
      console.log(this.rankings);
      this.constructCompiledDataTable();
    });
  }

  ngOnInit() {
    
  }

  loadRankings() : Promise<Ranking[]> {
    return new Promise((resolve, reject) => {
      this.rankingService.getRankings().subscribe((rankings) => {
        this.rankings = rankings
        resolve();
      });
    });
  }

  constructCompiledDataTable() {
    this.columns = [
      { prop: 'title', name: 'Title' },
      { prop: 'avgrating', name: 'Average Rating' },
      { prop: 'percent', name: 'Percentage of 3\'s'},
      { prop: 'sum', name: 'Number of 3\'s'},
      { prop: 'total', name: "Total # of Ratings"}
    ];
      let uniqueTitles = this.getUniqueTitles(this.rankings);
      this.rows = uniqueTitles.map(bookTitle => {
        return {
          title : bookTitle,
          avgrating : this.calculateAverageRatingPerTitle(this.rankings, bookTitle),
          percent : this.calculatePercentagePerScore(this.rankings, bookTitle, 3),
          sum : this.calculateSumPerScore(this.rankings, bookTitle, 3),
          total : this.calculateTotal(this.rankings, bookTitle)
        }
      });
  }

  constructRawDataTable() {
    let dummyRanking = new RankingProps();
    this.columns = Object.keys(dummyRanking).map(key => {
      return { prop: key, name: key }
    });
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

}
