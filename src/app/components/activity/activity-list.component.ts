import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { UserService } from 'src/app/services';
import { ActivityService } from 'src/app/services/activity.service';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';

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
    userSelected;
    userName;

    public dataSource: any;
    public pageSize = 6;
    public currentPage = 0;
    public totalSize = 0;
    public pageSizeOptions: number[] = [3, 6, 9];

    @ViewChild(MatPaginator, {static: false})
    private paginator: MatPaginator;

    /* Constructor */
    constructor(
        private router: Router,
        public firebaseService: FirebaseService,
        public dialog: MatDialog,
        private encryptService: EncryptService,
        private translate: TranslateService,
        public authService: AuthService,
        private excelService: ExcelService,
        private emailService: EmailService,
        private userService: UserService,
        private activityService: ActivityService
    ) {
        // Set localStorage: currentEntity.
        localStorage.setItem('currentEntity', 'activity');
        this.userName = localStorage.getItem('userName').replace('@fsoft.com.vn', '');
        this.dateFormat = localStorage.getItem('dateFormat');//.replace(/D/g, 'd').replace(/Y/g, 'y');
    }
    /* OnInit */
    ngOnInit() {
        this.getActivities();
        this.userSelected = JSON.parse(localStorage.getItem('userSelected'));
        //console.log('Undefine:' + this.encryptService.encrypt('Undefine'));
    }

    /*----------------------------- */
    /*---------- Methods ---------- */
    /*----------------------------- */

    public handlePage(event: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const items = this.activities.slice(start, end);
        this.dataSource = items;
    }

    getActivities() {
        const owner = localStorage.getItem('idUserSelected');
        this.activityService.getByPropertyOrderByWorkDate('owner', owner, false).then((response: any) => {
            this.activities = response;
            this.dataSource = new MatTableDataSource<Element>(this.activities);
            this.dataSource.paginator = this.paginator;
            this.totalSize = this.activities.length;
            this.iterator();
        });
    }

    deleteActivity(activity, id) {
        const dialogData: DialogOkCancelData = { title: 'Warning', content: this.translate.instant('activity.areYouDelete'), result: -1 };
        const dialogRef = this.dialog.open(DialogOkCancelComponent, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            if (dialogData.result === 1) {
                this.firebaseService.deleteDocument(this.COLLECTION, activity.id).then(result => {
                    // send mail.
                    const userName = localStorage.getItem('userName');
                    const subject = 'Work log (Delete by ' + userName + ')';
                    const toEmails = 'thanh-nhut.vo@aia.com';
                    const fullName = this.userService.users[activity.owner].surname + ' ' + this.userService.users[activity.owner].name;
                    const mailData = {
                        'from': userName,
                        'to': toEmails,
                        'subject': subject,
                        'text': '',
                        'html': '<h2>Dear ' + activity.reportTo + ',</h2>'
                         + '<p>'
                         + '<ul style="list-style-type:none;">'
                         + '<li>Người làm: ' + fullName + '</li>'
                         + '<li>Project: ' + activity.projectName + '</li>'
                         + '<li>Công việc: ' + activity.code + '</li>'
                         + '<li>Ngày làm: ' + this.datePipe.transform(activity.workDate, localStorage.getItem('dateFormat')).toString() + '</li>'
                         + '<li>Trạng thái: ' + activity.status + '</li>'
                         + '</ul>'
                         + '</p>'
                         + '<p>'
                         + 'Best Regards, <br>'
                         + '<span style="font-weight: bold">' + JSON.parse(localStorage.getItem('userSelected')).userName.replace('@fsoft.com.vn', '').toUpperCase() + '</span>'
                         + '</p>'
                    };
                    this.emailService.send(mailData).subscribe((response) => {
                        //console.log(response);
                    });
                    this.getActivities();
                });
            }
        });
    }

    exportAsXLSX(): void {
        // send mail.
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
            reporter = this.userService.users[item.owner].name;
            estimate = 1;
            remaining = 0;
            if (item.status.toLowerCase() === 'In Progress'.toLowerCase()) {
                estimate += 1;
                remaining += 1;
            }
            worked = estimate - remaining;
            workdate = this.datePipe.transform(item.workDate, localStorage.getItem('dateFormat'));
            const worklogDay = 'Coding;' + workdate + ';' + this.userService.users[item.owner].account + ';' + (worked);
            const worklog = 'Coding;' + workdate + ';' + this.userService.users[item.owner].account + ';' + (worked * daySeconds);
            const data = {};
            data['Project Name'] = item.projectName;
            data['Project key'] = null;
            data['Summary'] = item.code.charAt(0).toUpperCase() + item.code.slice(1);
            data['Issue Type'] = item.type;
            data['Reporter'] = item.reportTo;
            data['Assignee'] = this.userService.users[item.owner].account;
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
        // Export to excel file.
        this.excelService.exportAsExcelFile(excelData, 'daily', 'DailyReport_' + this.datePipe.transform(new Date(), 'yyyyMMdd') + '(' + reporter + ')');
    }
}
