import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable, ReplaySubject } from 'rxjs';
export interface User {
  counterId: string;
}
export interface Counter {
  count: number;
}
@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})


export class CounterComponent implements OnInit {
  userId: string;
  $user: AngularFirestoreDocument;
  user: User;
  $counterRef: ReplaySubject<AngularFirestoreDocument<Counter>>;
  counterRef: AngularFirestoreDocument<Counter>;
  $counter: Observable<Counter>;
  counter: Counter;
  constructor(
    public afAuth: AngularFireAuth,
    public fs: AngularFirestore) { }

  ngOnInit() {
    this.$counterRef = new ReplaySubject(1);
    this.userId = this.afAuth.auth.currentUser.uid;
    this.$user = this.fs.doc(`users/${this.userId}`);
    this.$user.valueChanges().subscribe((user: User) => {
      console.log('user', user);
      this.user = user;
      this.$counterRef.next(this.fs.doc(`counters/${user.counterId}`));
    });
    this.$counterRef.subscribe(ref => {
      this.counterRef = ref;
      ref.valueChanges().subscribe(counterData => {
        console.log('counterData', counterData);
        this.counter = counterData;
      });
    });
  }
  async changeCount(modifier) {
    this.fs.firestore.runTransaction(transaction => {
      return transaction.get(this.counterRef.ref).then((counterDoc) => {
        if (!counterDoc.exists) {
          throw "Document does not exist!";
        }

        var newCount = (counterDoc.data().count || 0) + modifier;
        transaction.update(this.counterRef.ref, { count: newCount });
      });
    })

  }


}
