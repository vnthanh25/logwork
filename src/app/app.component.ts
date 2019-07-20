import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'log work';
  constructor(private loadingBar: SlimLoadingBarService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('vi');
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');
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
        this.router.navigate(['/new-user']);
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
