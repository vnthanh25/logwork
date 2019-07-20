import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Activity } from 'src/app/models/activity';
import { DatePipe } from '@angular/common';

import {ExcelService} from '../../services/excel.service';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
    COLLECTION = 'activities';
    datePipe = new DatePipe('en-US');
    activities: Array<any>;


    /* Constructor */
    constructor(
        private excelService: ExcelService,
        private router: Router,
        public firebaseService: FirebaseService
    ) {
        // Set localStorage: currentEntity.
        localStorage.setItem('currentEntity', 'activity');
    }
    /* OnInit */
    ngOnInit() {
        this.getActivities();
    }
    /*----------------------------- */
    /*---------- Methods ---------- */
    /*----------------------------- */

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
        });
    }

    deleteActivity(id) {
        this.firebaseService.deleteDocument(this.COLLECTION, id).then(result => {
            alert('Deleted');
        });
    }

    
    exportAsXLSX():void {
        this.excelService.exportAsExcelFile(this.activities, 'DailyReport_' + this.datePipe.transform(new Date(), 'yyyyMMdd'), 'daily');
    }
}