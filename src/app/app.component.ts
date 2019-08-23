import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { I18nProvider } from './providers/I18nProvider';
import { DialogOkCancelData, DialogOkCancelComponent } from './components/dialog/dialog-ok-cancel.component';
import { MatDialog } from '@angular/material';
import { UserService } from './services';
import { EventProvider } from './providers/EventProvider';
//import { LocalizeRouterService } from 'localize-router';

import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private fullName = '';
  mobileQuery: MediaQueryList;
  isMenuToogle: boolean;

  constructor(
    private loadingBar: SlimLoadingBarService,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private translate: TranslateService,
    private i18nProvider: I18nProvider,
    private eventProvider: EventProvider,
    //private localizeRouterService: LocalizeRouterService,
    public dialog: MatDialog,
    public authService: AuthService,
    private userService: UserService
  ) {

    const language = 'vi';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(language);
    this.i18nProvider.defaultLanguage = language;
    localStorage.setItem('language', language);
    localStorage.setItem('dateFormat', 'dd/MM/yyyy');

    /* translate.addLangs(["en", "vi"]);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|vi/) ? browserLang : 'vi'); */
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      //console.log('onLangChange');
    });
    this.translate.onTranslationChange.subscribe((event: LangChangeEvent) => {
      //console.log('onTranslationChange');
    });

    this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      //console.log('onDefaultLangChange');
    });
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');
    // Default redirect to activity.
    if (localStorage.getItem('userName')) {
      this.userService.searchByUserName(localStorage.getItem('userName')).subscribe((response: any[]) => {
        if (response.length > 0) {
          const user = response[0];
          localStorage.setItem('currentEntity', 'activity');
          localStorage.setItem('idUserSelected', user.payload.doc.id);
          localStorage.setItem('userSelected', JSON.stringify(user.payload.doc.data()));
          // Emit user logined.
          this.eventProvider.eventLogined.emit(user.payload.doc.data());
          // Redirect to activity.
          this.router.navigate(['/activity']);
        }
      });
    }
    // Listen user login.
    this.eventProvider.eventLogined.subscribe((user:any) => {
      this.fullName = user.surname + ' ' + user.name;
    });
  }

  ngOnInit() {
    this.mobileQuery = this.mediaMatcher.matchMedia('(min-width: 600px)');
    this.isMenuToogle = this.mobileQuery.matches;
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  mobileQueryListener(event) {
    //this.changeDetectorRef.detectChanges();
    console.log(event.matches ? 'match' : 'no match');
  }

  menuToggle() {
    this.isMenuToogle = !this.isMenuToogle;
  }
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }

  useLanguage(language: string) {
    localStorage.setItem('language', language);
    this.translate.use(language);
    this.i18nProvider.defaultLanguage = language;
    this.i18nProvider.eventLanguageChange.emit(language);
    if (language === 'vi') {
      localStorage.setItem('dateFormat', 'dd/MM/yyyy');
    } else {
      localStorage.setItem('dateFormat', 'MM/dd/yyyy');
    }
  }

  /* Login */
  login() {
    //this.router.navigate(['/login']);
    this.authService.signInWithMicrosoft().then(response => {
      const userName = response.additionalUserInfo.profile['mail'].toLowerCase();
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
    }).catch(error => {
      console.log(error);
    });
  }

  /* Logout */
  logout() {
    this.authService.logout().then(response => {
    //this.authService.logoutMicrosoft().then(response => {
      this.fullName = '';
      localStorage.removeItem('userName');
      localStorage.removeItem('idUserSelected');
      localStorage.removeItem('userSelected');
      localStorage.removeItem('idUserLogined');
      localStorage.removeItem('userLogined');
      this.router.navigate(['/']);
    });
  }

  /* Change password */
  changePassword() {
    
    const dialogData: DialogOkCancelData = { title: this.translate.instant('app.changePasswordTitle'), content: this.translate.instant('app.changePasswordContent'), result: -1 };
    const dialogRef = this.dialog.open(DialogOkCancelComponent, {
        data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
        if (dialogData.result === 1) {
            this.authService.changePassword(localStorage.getItem('userName')).then(response => {

            }).catch(error => {

            });
        }
    });
  }

  /* List action */
  listAction() {
    const currentEntity = localStorage.getItem('currentEntity');

    switch (currentEntity) {
      case 'user': {
        // Route.
        this.router.navigate(['/user']);
        break;
      }
      case 'activity': {
        // Route.
        this.router.navigate(['/activity']);
        break;
      }
    }
  }

  /* Add action */
  addAction() {
    const currentEntity = localStorage.getItem('currentEntity');

    switch (currentEntity) {
      case 'user': {
        // Route.
        this.router.navigate(['/user/create']);
        break;
      }
      case 'activity': {
        // Route.
        this.router.navigate(['/activity/create']);
        break;
      }
    }
  }

  fullNameAction() {
    localStorage.setItem('currentEntity', 'activity');
    localStorage.setItem('idUserSelected', localStorage.getItem('idUserLogined'));
    localStorage.setItem('userSelected', localStorage.getItem('userLogined'));
    // Redirect to activity.
    this.router.navigated = false;
    this.router.navigate(['/activity']);
  }

}
