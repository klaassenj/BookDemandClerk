import { Component, OnInit } from '@angular/core';
import { Ranking, RankingService } from '../services/ranking.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 
  rankings: Ranking[];
 
  constructor(private rankingService: RankingService) { }
 
  ngOnInit() {
    this.rankingService.getRankings().subscribe(res => {
      this.rankings = res;
    });
  }
 
  remove(item) {
    this.rankingService.removeRanking(item.id);
  }
}