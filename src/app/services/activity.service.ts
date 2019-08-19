import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { EncryptService } from './encrypt.service';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { retry } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ActivityService {
    private COLLECTION: string = 'activities';
    public activities: any[];
    datePipe = new DatePipe('en-US');
    constructor(
        private firebaseService: FirebaseService,
        private fireStore: AngularFirestore,
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
                        let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
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
                        let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
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
        let fromDate1 = fromDate;
        if (moment.isMoment(fromDate1)) {
            fromDate1 = fromDate1.utc().format();
        } else {
            fromDate1 = fromDate1.format();
        }
        let toDate1 = toDate.add(1, 'd');
        if (moment.isMoment(toDate1)) {
            toDate1 = toDate1.utc().format();
        } else {
            toDate1 = toDate1.format();
        }
        return new Promise((resolve, reject) => {
            this.fireStore.collection(this.COLLECTION, ref => ref
                .where(name, '==', value)
                .where('workDate' , '>=', fromDate1)
                .where('workDate', '<', toDate1)
            ).snapshotChanges().subscribe(result => {
                const datePipe = this.datePipe;
                let activities = [];
                if (result.length > 0) {
                    activities = result.map(item => {
                        let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
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

    getByPropertyOrderByWorkDate(name, value) {
        return new Promise((resolve, reject) => {
            this.firebaseService.searchDocumentsByProperty(this.COLLECTION, name, value).subscribe(result => {
                const datePipe = this.datePipe;
                let activities = [];
                if (result.length > 0) {
                    activities = result.map(item => {
                        let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
                        activity['code'] = this.encryptService.decrypt(activity['code']);
                        activity['summary'] = activity['summary'] ? this.encryptService.decrypt(activity['summary']) : '';
                        activity['projectName'] = this.encryptService.decrypt(activity['projectName']);
                        
                        return activity;
                    });
                    // Sort by workDate.
                    activities = activities.sort(function(item1: any, item2: any) {
                        // value1.
                        let value1 = item1.workDate;
                        //const numbers1 = value1.match(/\d+/g);
                        //value1 = new Date(numbers1[2], numbers1[1] - 1, numbers1[0]);
                        value1 = datePipe.transform(value1, 'yyyyMMdd').toString();
                        // value2.
                        let value2 = item2.workDate;
                        //const numbers2 = value2.match(/\d+/g);
                        //value2 = new Date(numbers2[2], numbers2[1] - 1, numbers2[0]);
                        value2 = datePipe.transform(value2, 'yyyyMMdd').toString();
                        // compare workDate asc.
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    });
                }
                resolve(activities);
            });
        });
    }
}
