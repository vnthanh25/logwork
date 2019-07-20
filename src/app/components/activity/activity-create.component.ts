import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MAT_DATE_FORMATS } from '@angular/material';

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

@Component({
    selector: 'app-activity-create',
    templateUrl: './activity-create.component.html',
    styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {
    COLLECTION = 'activities';
    createActivityForm: FormGroup;
    activityTypes: string[] = ['Epic','Story','Task','Sub-task','SIT Bug','UAT Bug','Project Detail','PROD Bug','Improvement','New Feature','Risk','Risk Action','Pentest','Defect','Source code review','Bug'];
    filteredActiviTypes: Observable<string[]>;
    statuses: string[] = ['ToDo','Done','Cancelled','Assigned','Fixed','Rejected','Analyst','Development','Pending','Requirement','Testing','UAT','Ready for UAT','In Progress','Reopened','Resolved','Closed'];
    filteredStatuses: Observable<string[]>;

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
        private formBuilder: FormBuilder,
        private router: Router,
        public firebaseService: FirebaseService
    ) {}

    /* Init */
    ngOnInit() {
        this.createForm();
        this.filteredActiviTypes = this.createActivityForm.controls.type.valueChanges.pipe(
            startWith(''),
            map(value => this.filterActiviTypes(value))
        );
        this.filteredStatuses = this.createActivityForm.controls.status.valueChanges.pipe(
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

    /* Create form */
    createForm() {
        this.createActivityForm = this.formBuilder.group({
            code: [
                '', Validators.required
            ],
            name: [
                '', Validators.required
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
            name: new FormControl('', Validators.required),
            projectName: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            reportTo: new FormControl('', Validators.required),
            workDate: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
        };
        this.createActivityForm = this.formBuilder.group(formControls);
    }

    /* Submit */
    onSubmit(value) {
        const activity = {
            code: value.code,
            name: value.name,
            projectName: value.projectName,
            type: value.type,
            reportTo: value.reportTo,
            workDate: value.workDate.format(),
            status: value.status,
            createdBy: localStorage.getItem('idUser'),
            createdDate: moment(new Date()).format(),
            lastModifiedBy: localStorage.getItem('idUser'),
            lastModifiedDate: moment(new Date()).format()
        };
        // Save.
        this.firebaseService.createDocument(this.COLLECTION, activity).then(result => {
            this.createActivityForm.reset();
        });
    }
}
