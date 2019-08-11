import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthService {
    private user: Observable<firebase.User>;
    private userDetails: firebase.User = null;

    constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
        this.user = firebaseAuth.authState;
        this.user.subscribe(
            (user) => {
                if (user) {
                    this.userDetails = user;
                } else {
                    this.userDetails = null;
                }
            }
        );
    }
    signInRegular(email, password) {
        const credential = firebase.auth.EmailAuthProvider.credential( email, password );
        return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }

    signInWithTwitter() {
        return this.firebaseAuth.auth.signInWithPopup(
            new firebase.auth.TwitterAuthProvider()
        );
    }
    signInWithFacebook() {
        return this.firebaseAuth.auth.signInWithPopup(
            new firebase.auth.FacebookAuthProvider()
        );
    }
    signInWithGoogle() {
        return this.firebaseAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        );
    }
    isLoggedIn() {
        if (this.userDetails == null ) {
            return false;
        } else {
            return true;
        }
    }
    logout() {
        return this.firebaseAuth.auth.signOut();
        //.then((res) => this.router.navigate(['/']));
    }

    changePassword(email: string) {
        return this.firebaseAuth.auth.sendPasswordResetEmail(email);
    }

    createUser(email, password) {
        return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
            // .then(() => {
            // this.service.save(user);
            // })
            // .catch((e) => console.log(e));
   }

}
