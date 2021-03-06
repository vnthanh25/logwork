import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MAT_DATE_FORMATS } from '@angular/material';
import { EncryptService } from 'src/app/services/encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services';
import { ProjectService } from 'src/app/services/project.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-activity-create',
    templateUrl: './activity-create.component.html',
    styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {
    COLLECTION = 'activities';
    createActivityForm: FormGroup;
    userSelected;
    projects: any[];
    filteredProjects: Observable<any[]>;
    activityTypes: string[] = ['Epic','Story','Task','Sub-task','SIT Bug','UAT Bug','Project Detail','PROD Bug','Improvement','New Feature','Risk','Risk Action','Pentest','Defect','Source code review','Bug'];
    filteredActiviTypes: Observable<string[]>;
    statuses: string[] = ['ToDo','Done','Cancelled','Assigned','Fixed','Rejected','Analyst','Development','Pending','Requirement','Testing','UAT','Ready for UAT','In Progress','Reopened','Resolved','Closed'];
    filteredStatuses: Observable<string[]>;
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
        private formBuilder: FormBuilder,
        private router: Router,
        public firebaseService: FirebaseService,
        private translate: TranslateService,
        public authService: AuthService,
        private encryptService: EncryptService,
        private emailService: EmailService,
        private userService: UserService,
        private projectService: ProjectService
    ) {}

    /* Init */
    ngOnInit() {
        this.createForm();
        // Listen project name change.
        this.filteredProjects = this.createActivityForm.controls.projectName.valueChanges.pipe(
            startWith(''),
            map(value => this.filterProjects(value))
        );
        this.filteredActiviTypes = this.createActivityForm.controls.type.valueChanges.pipe(
            startWith(''),
            map(value => this.filterActiviTypes(value))
        );
        this.filteredStatuses = this.createActivityForm.controls.status.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStatuses(value))
        );
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
        this.createActivityForm = this.formBuilder.group({
            code: [
                '', Validators.required
            ],
            summary: [
                ''
            ],
            projectName: [
                '', Validators.required
            ],
            type: [
                '', Validators.required
            ],
            reportTo: [
                '', Validators.required
            ],
            reportToEmails: [
                ''
            ],
            workDate: [
                '', Validators.required
            ],
            status: [
                '', Validators.required
            ]
        });
    }

    /* Reset fields */
    resetFields() {
        let formControls = {
            code: new FormControl('', Validators.required),
            summary: new FormControl(''),
            projectName: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            reportTo: new FormControl('', Validators.required),
            reportToEmails: new FormControl(''),
            workDate: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
        };
        this.createActivityForm = this.formBuilder.group(formControls);
    }

    getProjects() {
        this.projectService.getAll().then(response => {
            this.projects = this.projectService.projects;
        });
    }

    /* Submit */
    onSubmit(value) {
        let workDate = value.workDate;
        if (value.workDate) {
            if (moment.isMoment(value.workDate)) {
                workDate = value.workDate.utc().format();
            } else {
                workDate = moment(value.workDate.toGMTString()).utc().format();
            }
        }
        const activity = {
            code: this.encryptService.encrypt(value.code),
            summary: value.summary ? this.encryptService.encrypt(value.summary) : '',
            projectName: this.encryptService.encrypt(value.projectName),
            type: value.type,
            reportTo: value.reportTo,
            reportToEmails: value.reportToEmails,
            workDate: workDate,
            status: value.status,
            owner: localStorage.getItem('idUserSelected'),
            createdBy: localStorage.getItem('userName'),
            createdDate: moment(new Date()).utc().format(),
            lastModifiedBy: localStorage.getItem('userName'),
            lastModifiedDate: moment(new Date()).utc().format()
        };
        // Save.
        this.firebaseService.createDocument(this.COLLECTION, activity).then(result => {
            const defaultEmail = 'thanh-nhut.vo@aia.com';
            const userSelected: any = JSON.parse(localStorage.getItem('userSelected'));
            let ccEmails = defaultEmail;
            if (userSelected.email) {
                ccEmails += ';' + userSelected.email;
            }
            const subject = 'Work log';
            let toEmails = '';
            if (activity.reportToEmails) {
                toEmails = activity.reportToEmails.toLowerCase();
                //toEmails = toEmails.replace(';' + defaultEmail, '').replace(defaultEmail + ';', '').replace(defaultEmail, '');
            } else {
                toEmails = defaultEmail;
            }
            const fullName = this.userService.users[activity.owner].surname + ' ' + this.userService.users[activity.owner].name;
            const mailData = {
                'from': localStorage.getItem('userName'),
                'to': toEmails,
                'cc': ccEmails,
                'subject': subject,
                'text': '',
                'html': '<h2>Dear ' + value.reportTo + ',</h2>'
                 + '<p>'
                 + '<ul style="list-style-type:none;">'
                 + '<li>Người làm: ' + fullName + '</li>'
                 + '<li>Project: ' + value.projectName + '</li>'
                 + '<li>Công việc: ' + value.code + '</li>'
                 + '<li>Ngày làm: ' + this.datePipe.transform(activity.workDate, localStorage.getItem('dateFormat')).toString() + '</li>'
                 + '<li>Trạng thái: ' + activity.status + '</li>'
                 + '</ul>'
                 + '</p>'
                 + '<p>'
                 + 'Best Regards, <br>'
                 + '<span style="font-weight: bold">' + JSON.parse(localStorage.getItem('userSelected')).userName.replace('@vnt.com.vn', '').toUpperCase() + '</span>'
                 + '</p>'
            };
           // send mail.
           this.emailService.send(mailData).subscribe((response) => {
                //console.log(response);
            });
            // Reset control values.
            this.createActivityForm.reset();
        }).catch(error => {
            alert(this.translate.instant('activity.pleaseLogin'));
        });
    }

    /* Cancel */
    cancel() {
        this.router.navigate(['/activity']);
    }
}
