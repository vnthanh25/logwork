import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { EncryptService } from './encrypt.service';
import { DatePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class LogCountService {
    private COLLECTION = 'logcounts';
    constructor(
        private firebaseService: FirebaseService
    ) {
        //this.getAll();
    }

    getAll() {
        return this.firebaseService.getDocuments(this.COLLECTION);
    }
}
