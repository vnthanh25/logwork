import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Activity } from 'src/app/models/activity';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ExcelService} from '../../services/excel.service';
import { DialogOkCancelData, DialogOkCancelComponent } from '../dialog/dialog-ok-cancel.component';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
    COLLECTION = 'activities';
    COLLECTION_USER = 'users';
    datePipe = new DatePipe('en-US');
    activities: Array<any>;
    users: {};

    /* Constructor */
    constructor(
        private excelService: ExcelService,
        private router: Router,
        public firebaseService: FirebaseService,
        public dialog: MatDialog
    ) {
        // Set localStorage: currentEntity.
        localStorage.setItem('currentEntity', 'activity');
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
        const lastModifiedBy = localStorage.getItem('idUser');
        this.firebaseService.searchDocumentsByProperty(this.COLLECTION, 'lastModifiedBy', lastModifiedBy).subscribe(result => {
            this.activities = result.map(item => {
                let activity = { id: item.payload.doc.id, ... item.payload.doc.data() };
                if (activity['workDate']) {
                    activity['workDate'] = this.datePipe.transform(activity['workDate'], 'dd/MM/yyyy');
                }
                return activity;
            });
            const datePipe = this.datePipe;
            // Sort by workDate.
            this.activities = this.activities.sort(function(item1: any, item2: any){
                const value1 = datePipe.transform(item1.workDate, 'yyyyMMdd').toLowerCase();
                const value2 = datePipe.transform(item2.workDate, 'yyyyMMdd').toLowerCase();
                if (value1 > value2) { return 1; }
                if (value1 < value2) { return -1; }
                return 0;
            });
        });
    }

    deleteActivity(id) {
        const dialogData: DialogOkCancelData = { title: 'Warning', content: 'Are you sure to delect it?', result: -1 };
        const dialogRef = this.dialog.open(DialogOkCancelComponent, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            if (dialogData.result === 1) {
                this.firebaseService.deleteDocument(this.COLLECTION, id).then(result => {
                });
            }
        });
    }

    
    exportAsXLSX(): void {
        const excelData = this.activities.map(item => {
            const data = {};
            data['Project Name'] = item.projectName;
            data['Summary'] = item.name;
            data['Type'] = item.type;
            data['Start Date'] = item.workDate;
            data['Assignee'] = this.users[item.lastModifiedBy].name;
            data['Report To'] = item.reportTo;
            data['Status'] = item.status;
            return data;
        });
        this.excelService.exportAsExcelFile(excelData, 'DailyReport_' + this.datePipe.transform(new Date(), 'yyyyMMdd'), 'daily');
    }
}
