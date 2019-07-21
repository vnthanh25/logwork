import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent implements OnInit {

  avatar: any;

  constructor(
    public dialogRef: MatDialogRef<AvatarDialogComponent>,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.firebaseService.getAvatars()
    .subscribe(data => this.avatar = data);
  }

  close(avatar){
    this.dialogRef.close(avatar);
  }

}
