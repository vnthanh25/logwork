import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material';
import { DatePipe } from '@angular/common';

import { DialogOkCancelData, DialogOkCancelComponent } from '../dialog/dialog-ok-cancel.component';
import { EncryptService } from 'src/app/services/encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services';
import { ProjectService } from 'src/app/services/project.service';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-activity-edit',
    templateUrl: './activity-edit.component.html',
    styleUrls: ['./activity-edit.component.scss']
})
export class ActivityEditComponent implements OnInit {
    COLLECTION = 'activities';
    editActivityForm: FormGroup;
    userSelected;
    projects: any[];
    filteredProjects: Observable<any[]>;
    activity: any;
    activityTypes: string[] = ['Epic','Story','Task','Sub-task','SIT Bug','UAT Bug','Project Detail','PROD Bug','Improvement','New Feature','Risk','Risk Action','Pentest','Defect','Source code review','Bug'];
    filteredActiviTypes: Observable<string[]>;
    statuses: string[] = ['ToDo','Done','Cancelled','Assigned','Fixed','Rejected','Analyst','Development','Pending','Requirement','Testing','UAT','Ready for UAT','In Progress','Reopened','Resolved','Closed'];
    filteredStatuses: Observable<string[]>;
    dialogTitle: string;
    dialogContent: string;
    datePipe = new DatePipe('en-US');
    
    validation_messages = {
        code: [
            { type: 'required', message: 'Code is required.' }
        ],
        projectName: [
            { type: 'required', message: 'Project name is required.' }
        ],
        type: [
            { type: 'required', message: 'Activity type is required.' }
        ],
        reportTo: [
            { type: 'required', message: 'Report to is required.' }
        ],
        workDate: [
            { type: 'required', message: 'Work date is required.' }
        ],
        status: [
            { type: 'required', message: 'Status is required.' }
        ]
    };

    /* Construtor */
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        public firebaseService: FirebaseService,
        public dialog: MatDialog,
        private translate: TranslateService,
        public authService: AuthService,
        private encryptService: EncryptService,
        private emailService: EmailService,
        private userService: UserService,
        private projectService: ProjectService
    ) {
        this.getProjects();
    }

    /* Init */
    ngOnInit() {
        this.route.data.subscribe(routeData => {
            const data = routeData['data'];
            if (data) {
                if (data['isCreate']) {
                    delete data['isCreate'];
                    delete data['id'];
                }
                this.activity = data;
                // Fill data to controls.
                if (this.activity.workDate) {
                    this.activity.workDate = moment(new Date(this.activity.workDate));
                }
                this.activity['projectName'] = this.encryptService.decrypt(this.activity['projectName']);
                this.activity['code'] = this.encryptService.decrypt(this.activity['code']);
                this.activity['summary'] = this.activity['summary'] ? this.encryptService.decrypt(this.activity['summary']) : '';
                // Create form group.
                this.createForm();
                // Listen project name change.
                this.filteredProjects = this.editActivityForm.controls.projectName.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterProjects(value))
                );
                // Listen activity type change.
                this.filteredActiviTypes = this.editActivityForm.controls.type.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterActiviTypes(value))
                );
                // Listen activity status change.
                this.filteredStatuses = this.editActivityForm.controls.status.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterStatuses(value))
                );
            }
        });
        this.userSelected = JSON.parse(localStorage.getItem('userSelected'));
    }

    private filterProjects(value: string): string[] {
        if (!this.projects) {
            this.getProjects();
            return null;
        }
        const filterValue = value ? value.toLowerCase() : '';

        return this.projects.filter(option => option ? option.name.toLowerCase().includes(filterValue) : false);
    }

    private filterActiviTypes(value: string): string[] {
        const filterValue = value ? value.toLowerCase() : '';

        return this.activityTypes.filter(option => option ? option.toLowerCase().includes(filterValue) : false);
    }

    private filterStatuses(value: string): string[] {
        const filterValue = value ? value.toLowerCase() : '';

        return this.statuses.filter(option => option ? option.toLowerCase().includes(filterValue) : false);
    }

    /*-----------------------------*/
    /*---------- Methods ----------*/
    /*-----------------------------*/

    /* Create form */
    createForm() {
        this.editActivityForm = this.formBuilder.group({
            code: [
                this.activity.code, Validators.required
            ],
            summary: [
                this.activity.summary
            ],
            projectName: [
                this.activity.projectName, Validators.required
            ],
            type: [
                this.activity.type, Validators.required
            ],
            reportTo: [
                this.activity.reportTo, Validators.required
            ],
            reportToEmails: [
                this.activity.reportToEmails
            ],
            workDate: [
                this.activity.workDate, Validators.required
            ],
            status: [
                this.activity.status, Validators.required
            ]
        });
    }

    /* Reset fields */
    resetFields() {
        this.editActivityForm = this.formBuilder.group({
            code: new FormControl('', Validators.required),
            summary: new FormControl(''),
            projectName: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            reportTo: new FormControl('', Validators.required),
            reportToEmails: new FormControl(''),
            workDate: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
        });
    }

    getProjects() {
        this.projectService.getAll().then(response => {
            this.projects = this.projectService.projects;
        });
    }

    /* Submit */
    onSubmit(value) {
        this.activity = { ... this.activity, ... value };
        if (this.activity.workDate) {
            if (moment.isMoment(this.activity.workDate)) {
                this.activity.workDate = this.activity.workDate.format();
            } else {
                this.activity.workDate = moment(this.activity.workDate.toGMTString()).format();
            }
        }
        this.activity.code = this.encryptService.encrypt(this.activity.code);
        this.activity.summary = this.activity.summary ? this.encryptService.encrypt(this.activity.summary) : '';
        this.activity.projectName = this.encryptService.encrypt(this.activity.projectName);
        this.activity.lastModifiedBy = localStorage.getItem('idUserSelected');
        this.activity.lastModifiedDate = moment(new Date()).format();
        // Save.
        let promiseResult = null;
        if (this.activity.id) {// update.
            promiseResult = this.firebaseService.updateDocument(this.COLLECTION, this.activity.id, this.activity);
        } else {// create.
            promiseResult = this.firebaseService.createDocument(this.COLLECTION, this.activity);
        }
        if (promiseResult) {
            promiseResult.then(result => {
                // send mail.
                const subject = 'Work log';
                let toEmails = 'vnthanh25@gmail.com';
                if (this.activity.reportToEmails) {
                    toEmails += ';' + this.activity.reportToEmails;
                }
                const fullName = this.userService.users[this.activity.owner].surname + ' ' + this.userService.users[this.activity.owner].name;
                const mailData = {
                    'from': localStorage.getItem('userName'),
                    'to': toEmails,
                    'subject': subject,
                    'text': '',
                    'html': '<h2>Dear ' + value.reportTo + ',</h2>'
                     + '<p>'
                     + '<ul style="list-style-type:none;">'
                     + '<li>Người làm: ' + fullName + '</li>'
                     + '<li>Project: ' + value.projectName + '</li>'
                     + '<li>Công việc: ' + value.code + '</li>'
                     + '<li>Ngày làm: ' + this.datePipe.transform(this.activity.workDate, localStorage.getItem('dateFormat')).toString() + '</li>'
                     + '<li>Trạng thái: ' + this.activity.status + '</li>'
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
                // Redirect to list.
                this.router.navigate(['/activity']);
            }).catch(error => {
                alert(this.translate.instant('activity.pleaseLogin'));
            });
        } else {
            alert(this.translate.instant('activity.pleaseLogin'));
        }
    }

    /* Delete */
    delete() {
        const dialogData: DialogOkCancelData = { title: 'Warning', content: this.translate.instant('activity.areYouDelete'), result: -1 };
        const dialogRef = this.dialog.open(DialogOkCancelComponent, {
            data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
            if (dialogData.result === 1) {
                this.firebaseService.deleteDocument(this.COLLECTION, this.activity.id).then( result => {
                    this.router.navigate(['/activity']);
                }, error => {
                    console.log(error);
                });
            }
        });
    }

    /* Cancel */
    cancel() {
        this.router.navigate(['/activity']);
    }
}
