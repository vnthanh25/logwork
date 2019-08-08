import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Activity } from 'src/app/models/activity';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ExcelService } from '../../services/excel.service';
import { EmailService } from '../../services/email.service';
import { DialogOkCancelData, DialogOkCancelComponent } from '../dialog/dialog-ok-cancel.component';
import { EncryptService } from 'src/app/services/encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
    COLLECTION = 'activities';
    COLLECTION_USER = 'users';
    public dateFormat: string;
    datePipe = new DatePipe('en-US');
    activities: Array<any>;
    userName;
    users: {};

    /* Constructor */
    constructor(
        private excelService: ExcelService,
        private emailService: EmailService,
        private router: Router,
        public firebaseService: FirebaseService,
        public dialog: MatDialog,
        private encryptService: EncryptService,
        private translate: TranslateService,
        public authService: AuthService
    ) {
        // Set localStorage: currentEntity.
        localStorage.setItem('currentEntity', 'activity');
        this.userName = localStorage.getItem('userName').replace('@fsoft.com.vn', '');
        this.dateFormat = localStorage.getItem('dateFormat').replace(/D/g, 'd').replace(/Y/g, 'y');
    }
    /* OnInit */
    ngOnInit() {
        this.getActivities();
        this.getUsers();
    }
    /*----------------------------- */
    /*---------- Methods ---------- */
    /*----------------------------- */

    getUsers() {
        this.firebaseService.getDocuments(this.COLLECTION_USER).subscribe(result => {
            const users = {};
            result.forEach(function(item) {
                users[item.payload.doc.id] = item.payload.doc.data();
            });
            this.users = users;
        });
    }

    getActivities() {
        const owner = localStorage.getItem('idUser');
        this.firebaseService.searchDocumentsByProperty(this.COLLECTION, 'owner', owner).subscribe(result => {
            const datePipe = this.datePipe;
            this.activities = result.map(item => {
                let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
                /*if (activity['workDate']) {
                    activity['workDate'] = datePipe.transform(activity['workDate'], localStorage.getItem('dateFormat')).toString();
                }
                 if (moment.isMoment(activity['workDate'])) {
                    activity['workDate'] = activity['workDate'].format();
                } else if (activity['workDate'] instanceof Date) {
                    activity['workDate'] = datePipe.transform(activity['workDate'], localStorage.getItem('dateFormat')).toString();
                } else {
                    const numbers = activity['workDate'].match(/\d+/g);
                    activity['workDate'] = new Date(numbers[2], numbers[1] - 1, numbers[0]);
                    activity['workDate'] = datePipe.transform(activity['workDate'], localStorage.getItem('dateFormat')).toString();
                } */
                
                activity['code'] = this.encryptService.decrypt(activity['code']);
                activity['summary'] = activity['summary'] ? this.encryptService.decrypt(activity['summary']) : '';
                activity['projectName'] = this.encryptService.decrypt(activity['projectName']);
                
                return activity;
            });
            // Sort by workDate.
            this.activities = this.activities.sort(function(item1: any, item2: any) {
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
                // compare.
                if (value1 > value2) { return -1; }
                if (value1 < value2) { return 1; }
                return 0;
            });
        });
    }

    deleteActivity(id) {
        const dialogData: DialogOkCancelData = { title: 'Warning', content: this.translate.instant('activity.areYouDelete'), result: -1 };
        const dialogRef = this.dialog.open(DialogOkCancelComponent, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            if (dialogData.result === 1) {
                this.firebaseService.deleteDocument(this.COLLECTION, id).then(result => {
                    this.getActivities();
                });
            }
        });
    }

    exportAsXLSX(): void {
        // send mail.
        this.emailService.send({});
        const daySeconds = 8 * 3600;
        let reporter;
        let estimate = 1;
        let worked = 1;
        let remaining = 0;
        let workdate;
        const length = this.activities.length;
        const excelData = [];
        for (let index = length - 1; index > -1; index--) {
            const item = this.activities[index];
            reporter = this.users[item.owner].name;
            estimate = 1;
            remaining = 0;
            if (item.status.toLowerCase() === 'In Progress'.toLowerCase()) {
                estimate += 1;
                remaining += 1;
            }
            worked = estimate - remaining;
            workdate = this.datePipe.transform(item.workDate, 'dd/MM/yyyy');
            const worklogDay = 'Coding;' + workdate + ';' + this.users[item.owner].account + ';' + (worked);
            const worklog = 'Coding;' + workdate + ';' + this.users[item.owner].account + ';' + (worked * daySeconds);
            const data = {};
            data['Project Name'] = item.projectName;
            data['Project key'] = null;
            data['Summary'] = item.code.charAt(0).toUpperCase() + item.code.slice(1);
            data['Issue Type'] = item.type;
            data['Reporter'] = item.reportTo;
            data['Assignee'] = this.users[item.owner].account;
            data['Start Date'] = workdate;
            data['Due Date'] = workdate;
            data['Original Estimate (day)'] = estimate;
            data['Worked (day)'] = worked;
            data['Remaining (day)'] = remaining;
            data['Status (day)'] = item.status;
            data['Worklog (comment;date_for_logwork;account;second) (day)'] = worklogDay;
            data['Original Estimate'] = estimate * daySeconds;
            data['Remaining'] = remaining * daySeconds;
            data['Status'] = item.status;
            data['Worklog (comment;date_for_logwork;account;second)'] = worklog;
            // push.
            excelData.push(data);
        }

        // const excelData = this.activities.map(item => {
        // });
        this.excelService.exportAsExcelFile(excelData, 'DailyReport_' + this.datePipe.transform(new Date(), 'yyyyMMdd') + '(' + reporter + ')', 'daily');
    }
}
