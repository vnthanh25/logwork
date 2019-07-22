import { OnInit, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    validation_messages = {
        email: [
            { type: 'required', message: 'Email is required.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' }
        ]
    };

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: [
                '', Validators.required
            ],
            password: [
                '', Validators.required
            ]
        });
    }

    /* Submit */
    onSubmit(value) {
        this.signInWithEmail(value.email, value.password);
    }

    signInWithEmail(email, password) {
        this.authService.signInRegular(email, password).then((response) => {
            localStorage.setItem('userName', email);
            this.router.navigate(['home']);
        }).catch((error) => {
            console.log('error: ' + error);
        });
    }

    /* Cancel */
    cancel() {
        this.router.navigate(['/home']);
    }
}
