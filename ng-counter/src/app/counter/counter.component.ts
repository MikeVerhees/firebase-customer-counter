import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

export interface User {
  counter: DocumentReference;
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
  constructor(
    public afAuth: AngularFireAuth,
    public fs: AngularFirestore) { }

  ngOnInit() {
    this.userId = this.afAuth.auth.currentUser.uid;
    this.$user = this.fs.doc(`users/${this.userId}`);
    this.$user.valueChanges().subscribe((user: User) => {
      console.log('user', user);
      this.user = user;
    });

  }

}
