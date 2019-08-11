import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
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

  userForm: FormGroup;
  user: any;
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
   ],
   'account': [
     { type: 'required', message: 'Account is required.' }
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
        this.user = data.payload.data();
        this.user.id = data.payload.id;
        this.avatar = this.user.avatar;
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
    this.userForm = this.fb.group({
      userName: [this.user.userName, Validators.required],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      account: [this.user.account, Validators.required]
    });
  }

  onSubmit(value) {
    value.id = this.user.id;
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
    //this.firebaseService.deleteDocument('users', this.user.id)
    this.userService.delete(this.user.id)
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
