import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from "../../avatar-dialog/avatar-dialog.component";
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  exampleForm: FormGroup;
  item: any;
  fileName: string;
  avatar: any;

  validation_messages = {
   'userName': [
     { type: 'required', message: 'User name is required.' }
   ],
   'name': [
     { type: 'required', message: 'Name is required.' }
   ],
   'surname': [
     { type: 'required', message: 'Surname is required.' }
   ]
 };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.avatar = this.item.avatar;
        this.createForm();
      }
    });
  }

  onFileChanged(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        this.fileName = file.name + " " + file.type;
        this.avatar = reader.result;
      };
    }
  }

  createForm() {
    this.exampleForm = this.fb.group({
      userName: [this.item.userName, Validators.required],
      name: [this.item.name, Validators.required],
      surname: [this.item.surname, Validators.required]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.item.avatar = result.link;
      }
    });
  }

  onSubmit(value) {
    value.id = this.item.id;
    value.avatar = this.avatar;
    value.userName = value.userName.toLowerCase();
    this.userService.update(value)
    .then(
      res => {
        this.router.navigate(['/user']);
      }
    );
  }

  delete() {
    //this.firebaseService.deleteDocument('users', this.item.id)
    this.userService.delete(this.item.id)
    .then(
      res => {
        this.router.navigate(['/user']);
      },
      err => {
        console.log(err);
      }
    );
  }

  cancel() {
    this.router.navigate(['/user']);
  }

}