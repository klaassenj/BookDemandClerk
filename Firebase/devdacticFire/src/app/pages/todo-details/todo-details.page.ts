import { Ranking, RankingService } from '../../services/ranking.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
 
@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {
 
  ranking: Ranking = {
    bookISBN: "",
    bookTitle: "",
    firstName: "",
    lastName: "",
    department: "",
    score: undefined
  };
 
  todoId = null;
 
  constructor(private route: ActivatedRoute, private nav: NavController, private rankingService: RankingService, private loadingController: LoadingController) { }
 
  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId)  {
      this.loadRanking();
    }
  }
 
  async loadRanking() {
    const loading = await this.loadingController.create({
      message: 'Loading Todo..'
    });
    await loading.present();
 
    this.rankingService.getRanking(this.todoId).subscribe(res => {
      loading.dismiss();
      this.ranking = res;
    });
  }
 
  async saveRanking() {
 
    const loading = await this.loadingController.create({
      message: 'Saving Todo..'
    });
    await loading.present();
 
    if (this.todoId) {
      this.rankingService.updateRanking(this.ranking, this.todoId).then(() => {
        loading.dismiss();
        this.nav.navigateBack('home');
      });
    } else {
      this.rankingService.addRanking(this.ranking).then(() => {
        loading.dismiss();
        this.nav.navigateBack('home');
      });
    }
  }
}