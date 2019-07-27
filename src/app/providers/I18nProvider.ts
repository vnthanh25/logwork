import { Injectable, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class I18nProvider {

    /* constructor(private translate: TranslateService) {}

    public switchLanguage(lang: string) {
    this.translate.use(lang);
    } */

    defaultLanguage;

    //@Output('languageChanged') 
    eventLanguageChange = new EventEmitter<string>();
}
