import { Component } from '@angular/core';
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
//import { LocalizeRouterService } from 'localize-router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'log work';
  constructor(
    private loadingBar: SlimLoadingBarService,
    private router: Router,
    private translate: TranslateService,
    private i18nProvider: I18nProvider,
    //private localizeRouterService: LocalizeRouterService,
    public dialog: MatDialog,
    public authService: AuthService,
    private userService: UserService
  ) {
    localStorage.setItem('dateFormat', 'dd/MM/yyyy');
    const language = 'vi';
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang(language);
    this.i18nProvider.defaultLanguage = language;

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
    if (localStorage.getItem('userName')) {
      this.userService.searchByUserName(localStorage.getItem('userName')).subscribe((response: any[]) => {
        if (response.length > 0) {
          const user = response[0];
          localStorage.setItem('currentEntity', 'activity');
          localStorage.setItem('idUserSelected', user.payload.doc.id);
          localStorage.setItem('userSelected', JSON.stringify(user.payload.doc.data()));
          this.router.navigate(['/activity']);
        }
      });
    }
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
    this.translate.use(language);
    this.i18nProvider.defaultLanguage = language;
    this.i18nProvider.eventLanguageChange.emit(language);
    if (language === 'vi') {
      localStorage.setItem('dateFormat', 'dd/MM/yyyy');
    } else {
      localStorage.setItem('dateFormat', 'MM/dd/yyyy');
    }
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

  /* Login */
  login() {
    this.router.navigate(['/login']);
  }

  /* Logout */
  logout() {
    this.authService.logout().then(response => {
      localStorage.removeItem('userName');
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

}
