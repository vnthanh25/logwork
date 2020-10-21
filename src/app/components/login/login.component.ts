import { OnInit, Component, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services';
import { EventProvider } from 'src/app/providers/EventProvider';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    validationMessages;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private translate: TranslateService,
        private eventProvider: EventProvider,
        private userService: UserService
    ) {
        this.validationMessages = {
            userName: [
                { type: 'required', message: this.translate.instant('login.userName') + ' ' + this.translate.instant('validation.isRequired') }
            ],
            password: [
                { type: 'required', message: this.translate.instant('login.password') + ' ' + this.translate.instant('validation.isRequired') }
            ]
        };
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            userName: [
                '', Validators.required
            ],
            password: [
                '', Validators.required
            ]
        });
    }

    /* Submit */
    onSubmit(value) {
        let userName: string = value.userName;
        if (userName.indexOf('@') < 0) {
            userName += '@vnt.com.vn';
        }
        this.signInWithEmail(userName, value.password);
    }

    signInWithEmail(userName, password) {
        this.authService.signInRegular(userName, password).then((response) => {
            this.userService.searchByUserName(userName).subscribe((users: any[]) => {
                if (users.length > 0) {
                  const user = users[0];
                  localStorage.setItem('idUserLogined', user.payload.doc.id);
                  localStorage.setItem('userLogined', JSON.stringify(user.payload.doc.data()));
                  // Emit user logined.
                  this.eventProvider.eventLogined.emit(user.payload.doc.data());
                }
            });
            localStorage.setItem('userName', userName);
            this.router.navigate(['home']);
        }).catch((error) => {
            alert('Error');
        });
    }

    /* Cancel */
    cancel() {
        this.router.navigate(['/home']);
    }
}
