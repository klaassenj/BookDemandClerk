import { Component, OnInit } from '@angular/core';
import { RankingService, Ranking } from '../services/ranking.service'
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
  constructor(private rankingService : RankingService, private http : HttpClient) {
    this.columns = [
      { prop: 'title', name: 'Title' },
      { prop: 'avgrating', name: 'Average Rating' },
      { prop: 'percent', name: 'Percentage of 3\'s'},
      { prop: 'sum', name: 'Number of 3\'s'}
    ];
    this.rankingService.getRankings().subscribe((rankings) => {
      console.log(rankings);
      let uniqueTitles = this.getUniqueTitles(rankings);
      this.rows = uniqueTitles.map(bookTitle => {
        return {
          title : bookTitle,
          avgrating : this.calculateAverageRatingPerTitle(rankings, bookTitle),
          percent : this.calculatePercentagePerScore(rankings, bookTitle, 3),
          sum : this.calculateSumPerScore(rankings, bookTitle, 3)
        }
      });
      console.log(this.rows);
    });
  }

  ngOnInit() {
    
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

  calculateAverageRatingPerTitle(rankings : Ranking[], title : String) : String {
    let allRatingsForThisTitle = rankings.filter(ranking => ranking.bookTitle == title); // Only ratings with this title
    return allRatingsForThisTitle.reduce((total, ranking) => total + ranking.score / allRatingsForThisTitle.length, 0).toFixed(2); // Average those ratings
  }

  calculatePercentagePerScore(rankings : Ranking[], title : String, score : number) {
    let scoreFilteredList = rankings.filter(ranking => { // Only ratings with a certain score and title
      return ranking.score == score && ranking.bookTitle == title; 
    });
    let allRatingsForThisTitle = rankings.filter(ranking => ranking.bookTitle == title);
    return scoreFilteredList.length / allRatingsForThisTitle.length * 100   + "%" // Number out of 100 of the total number of ratings for that title
  }

  calculateSumPerScore(rankings : Ranking[], title : String, score : number) {
    let scoreFilteredList = rankings.filter(ranking => { // Only ratings with a certain score and title
      return ranking.score == score && ranking.bookTitle == title; 
    });
    return scoreFilteredList.length;
  }

}
