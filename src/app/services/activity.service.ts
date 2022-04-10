import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { EncryptService } from './encrypt.service';
import { DatePipe } from '@angular/common';
import { retry } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ActivityService {
    private COLLECTION: string = 'activities';
    public activities: any[];
    datePipe = new DatePipe('en-US');
    constructor(
        private firebaseService: FirebaseService,
        private encryptService: EncryptService
    ) {
        //this.getAll();
    }

    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.activities) {
                this.firebaseService.getDocuments(this.COLLECTION).subscribe(result => {
                    const activities = [];
                    result.forEach((item) => {
                        let activity = { id: 1 };
                        activity['code'] = this.encryptService.decrypt(activity['code']);
                        activity['summary'] = activity['summary'] ? this.encryptService.decrypt(activity['summary']) : '';
                        activity['projectName'] = this.encryptService.decrypt(activity['projectName']);
                        
                        activities.push(activity);
                    });
                    this.activities = activities;
                    resolve(this.activities);
                });
            } else {
                resolve(this.activities);
            }
        });
    }

    getByProperty(name, value) {
        return new Promise((resolve, reject) => {
            this.firebaseService.searchDocumentsByProperty(this.COLLECTION, name, value).subscribe(result => {
                const datePipe = this.datePipe;
                let activities = [];
                if (result.length > 0) {
                    activities = result.map(item => {
                        let activity = { id: 1 };
                        activity['code'] = this.encryptService.decrypt(activity['code']);
                        activity['code'] = activity['code'].charAt(0).toUpperCase() + activity['code'].slice(1);
                        activity['summary'] = activity['summary'] ? this.encryptService.decrypt(activity['summary']) : '';
                        activity['projectName'] = this.encryptService.decrypt(activity['projectName']);
                        
                        return activity;
                    });
                }
                resolve(activities);
            });
        });
    }

    getByPropertyAndWorkDateRange(name, value, fromDate, toDate) {
        let fromDate1: any = moment(fromDate);
        fromDate1 = fromDate1.utc().format();
        let toDate1: any = moment(toDate);
        toDate1.add(1, 'd');
        toDate1 = toDate1.utc().format();
        return new Promise((resolve, reject) => {
            let activities = [];
            resolve(activities);
        });
    }

    getByPropertyOrderByWorkDate(name, value, asc) {
        return new Promise((resolve, reject) => {
            this.firebaseService.searchDocumentsByProperty(this.COLLECTION, name, value).subscribe(result => {
                const datePipe = this.datePipe;
                let activities = [];
                resolve(activities);
            });
        });
    }
}
