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
      { name: 'Name' },
      { name: 'Company' },
      { name: 'Genre' }
    ];
    this.http.get<Data>('../../assets/movies.json')
      .subscribe((res) => {
        console.log(res)
        this.rows = res.movies;
      });
  }

  ngOnInit() {
    
  }

}
