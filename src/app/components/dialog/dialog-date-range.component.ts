import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-date-range-cancel',
    templateUrl: './dialog-date-range.component.html',
    styleUrls: ['./dialog-date-range.component.scss']
})
export class DialogDateRangeComponent {
    formGroup: FormGroup;
    validation_messages = {
        fromDate: [
            { type: 'required', message: 'From date is required.' }
        ],
        toDate: [
            { type: 'required', message: 'To date is required.' }
        ]
    };

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogDateRangeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.formGroup = this.formBuilder.group({
            fromDate: [
                '', Validators.required
            ],
            toDate: [
                ''
            ]
        });
    }
  
    onCancelClick(): void {
        this.data.result = null;
        this.dialogRef.close();
    }

    onOkClick() : void {
        this.data.result = this.formGroup.value;
        this.dialogRef.close();
    }
}