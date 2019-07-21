import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogOkCancelData {
    title: string;
    content: string;
    result: any;
}

@Component({
    selector: 'dialog-ok-cancel',
    templateUrl: './dialog-ok-cancel.component.html',
    styleUrls: ['./dialog-ok-cancel.component.scss']
})
export class DialogOkCancelComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogOkCancelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogOkCancelData
    ) {}
  
    onCancelClick(): void {
        this.data.result = 0;
        this.dialogRef.close();
    }

    onOkClick() : void {
        this.data.result = 1;
        this.dialogRef.close();
    }
}