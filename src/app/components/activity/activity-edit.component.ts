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

export const DD_MM_YYYY_Format = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

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
    activity: any;
    activityTypes: string[] = ['Epic','Story','Task','Sub-task','SIT Bug','UAT Bug','Project Detail','PROD Bug','Improvement','New Feature','Risk','Risk Action','Pentest','Defect','Source code review','Bug'];
    filteredActiviTypes: Observable<string[]>;
    statuses: string[] = ['ToDo','Done','Cancelled','Assigned','Fixed','Rejected','Analyst','Development','Pending','Requirement','Testing','UAT','Ready for UAT','In Progress','Reopened','Resolved','Closed'];
    filteredStatuses: Observable<string[]>;
    dialogTitle: string;
    dialogContent: string;
    
    validation_messages = {
        code: [
            { type: 'required', message: 'Code is required.' }
        ],
        name: [
            { type: 'required', message: 'Name is required.' }
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
        public dialog: MatDialog
    ) {}

    /* Init */
    ngOnInit() {
        this.editForm();
        this.filteredActiviTypes = this.editActivityForm.controls.type.valueChanges.pipe(
            startWith(''),
            map(value => this.filterActiviTypes(value))
        );
        this.filteredStatuses = this.editActivityForm.controls.status.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStatuses(value))
        );
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

    /* Edit form */
    editForm() {
        this.route.data.subscribe(routeData => {
            const data = routeData['data'];
            if (data) {
              this.activity = data;
              if (this.activity.workDate) {
                this.activity.workDate = moment(new Date(this.activity.workDate));
              }
              this.createForm();
            }
          });
    }

    /* Create form */
    createForm() {
        this.editActivityForm = this.formBuilder.group({
            code: [
                this.activity.code, Validators.required
            ],
            name: [
                this.activity.name, Validators.required
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
            name: new FormControl('', Validators.required),
            projectName: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            reportTo: new FormControl('', Validators.required),
            workDate: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
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
        this.activity.lastModifiedBy = localStorage.getItem('idUser');
        this.activity.lastModifiedDate = moment(new Date()).format();
        // Save.
        this.firebaseService.updateDocument(this.COLLECTION, this.activity.id, this.activity).then(result => {
            this.router.navigate(['/activity']);
        });
    }

    /* Delete */
    delete() {
        const dialogData: DialogOkCancelData = { title: 'Warning', content: 'Are you sure to delect it?', result: -1 };
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
