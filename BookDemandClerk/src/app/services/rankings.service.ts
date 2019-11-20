import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
 
export interface Ranking {
  id?: string,
  bookISBN: string,
  bookTitle: string,
  firstName: string,
  lastName: string,
  department: string,
  score: number
}
 
@Injectable()
export class RankingService {
  private rankings: Observable<Ranking[]>;
  private rankingCollection: AngularFirestoreCollection<Ranking>;
 
  constructor(private afs: AngularFirestore) {
    this.rankingCollection = this.afs.collection<Ranking>('rankings');
    this.rankings = this.rankingCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getIdeas(): Observable<Ranking[]> {
    return this.rankings;
  }
 
  getIdea(id: string): Observable<Ranking> {
    return this.rankingCollection.doc<Ranking>(id).valueChanges().pipe(
      take(1),
      map(ranking => {
        ranking.id = id;
        return ranking
      })
    );
  }
 
  addIdea(ranking: Ranking): Promise<DocumentReference> {
    return this.rankingCollection.add(ranking);
  }
 
  updateIdea(ranking: Ranking): Promise<void> {
    return this.rankingCollection.doc(ranking.id).update({ 
        bookISBN: ranking.bookISBN,
        bookTitle: ranking.bookTitle,
        firstName: ranking.firstName,
        lastName: ranking.lastName,
        department: ranking.department,
        ranking: ranking.score 
    });
  }
 
  deleteIdea(id: string): Promise<void> {
    return this.rankingCollection.doc(id).delete();
  }
}