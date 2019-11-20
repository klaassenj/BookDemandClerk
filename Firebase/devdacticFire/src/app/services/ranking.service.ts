import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ranking {
  id?: string,
  bookISBN: string,
  bookTitle: string,
  firstName: string,
  lastName: string,
  department: string,
  score: number
}
 
@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private rankingsCollection: AngularFirestoreCollection<Ranking>;
 
  private rankings: Observable<Ranking[]>;
 
  constructor(db: AngularFirestore) {
    this.rankingsCollection = db.collection<Ranking>('rankings');
 
    this.rankings = this.rankingsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getRankings() {
    return this.rankings;
  }
 
  getRanking(id) {
    return this.rankingsCollection.doc<Ranking>(id).valueChanges();
  }
 
  updateRanking(ranking: Ranking, id: string) {
    return this.rankingsCollection.doc(id).update(ranking);
  }
 
  addRanking(ranking: Ranking) {
    return this.rankingsCollection.add(ranking);
  }
 
  removeRanking(id) {
    return this.rankingsCollection.doc(id).delete();
  }
}