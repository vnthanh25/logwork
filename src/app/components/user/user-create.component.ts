import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import {DomSanitizer} from '@angular/platform-browser';
import { UserService } from '../../services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  exampleForm: FormGroup;
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
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  onFileChanged(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        this.fileName = file.name + ' ' + file.type;
        this.avatar = reader.result;
      };
    }
  }

  sanitize(url: string) {
    //return url;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  createForm() {
    this.exampleForm = this.fb.group({
      userName: ['', Validators.required ],
      name: ['', Validators.required ],
      surname: ['', Validators.required ]
    });
    this.avatar = '//:0';
  }

  resetFields() {
    this.exampleForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required)
    });
    this.avatar = '//:0';
  }

  onSubmit(value) {
    const user = {
      userName: value.userName.toLowerCase(),
      name: value.name,
      surname: value.surname,
      avatar: this.avatar
    };
    //this.firebaseService.createDocument('users', user)
    this.userService.create(user)
    .then(
      res => {
        this.resetFields();
        this.router.navigate(['/user']);
      }
    );
  }

  cancel() {
    this.router.navigate(['/user']);
  }

}
