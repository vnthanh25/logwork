import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    private COLLECTION = 'users';
    private DEFAULT_MK = '123456';
    public users = {};

    constructor(
        private authService: AuthService,
        private firebaseService: FirebaseService
    ) {
        this.firebaseService.getDocuments(this.COLLECTION).subscribe(result => {
            const users = {};
            result.forEach((item) => {
                users[item.payload.doc.id] = item.payload.doc.data();
            });
            this.users = users;
        });
    }

    create(user) {
        return new Promise((resolve, reject) => {
            this.authService.createUser(user.userName, this.DEFAULT_MK).then(response => {
                this.firebaseService.createDocument(this.COLLECTION, user).then(response1 => {
                    resolve(response1);
                }).catch(error1 => {
                    reject(error1);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    update(user) {
        return this.firebaseService.updateDocument(this.COLLECTION, user.id, user);
    }

    delete(id) {
        return this.firebaseService.deleteDocument(this.COLLECTION, id);
    }

    getAll() {
        return this.firebaseService.getDocuments(this.COLLECTION);
    }

    searchByUserName(userName) {
        return this.firebaseService.searchDocumentsByStartAtProperty(this.COLLECTION, 'userName', userName);
    }
}
