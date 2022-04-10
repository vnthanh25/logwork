import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

const userUrl = 'assets/data/user.json';
const usersUrl = 'assets/data/users.json';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private router: Router) {
    }
    signInRegular(email, password) {
        //const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this.http.get<Object>(userUrl).toPromise();
    }
    isLoggedIn() {
        return true;
    }
    logout() {
        // return this.firebaseAuth.auth.signOut();
        //.then((res) => this.router.navigate(['/']));
    return this.http.get<Object>(userUrl).toPromise();
    }

    changePassword(email: string) {
        // return this.firebaseAuth.auth.sendPasswordResetEmail(email);
    return this.http.get<Object>(userUrl).toPromise();
    }

    createUser(email, password) {
        // return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
            // .then(() => {
            // this.service.save(user);
            // })
            // .catch((e) => console.log(e));
    return this.http.get<Object>(userUrl).toPromise();
   }

}
