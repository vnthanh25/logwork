import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class MatPaginatorIntlProvider extends MatPaginatorIntl implements OnDestroy {
    private onDestroy$: Subject<boolean> = new Subject();
    public constructor(private translate: TranslateService) {
      super();

      this.translate.onLangChange.subscribe((e: Event) => {
        this.getAndInitTranslations();
      });

      this.getAndInitTranslations();
    }

    public getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0 || pageSize === 0) {
        return `0 / ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex: number = page * pageSize;
      const endIndex: number = startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} / ${length}`;
    }

    public getAndInitTranslations(): void {
        this.translate
        .stream([
            'ITEMS_PER_PAGE_LABEL',
            'NEXT_PAGE_LABEL',
            'PREVIOUS_PAGE_LABEL',
            'FIRST_PAGE_LABEL',
            'LAST_PAGE_LABEL',
            'RANGE_PAGE_LABEL_1',
            'RANGE_PAGE_LABEL_2'
        ])
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(translations => {
            this.itemsPerPageLabel = translations['ITEMS_PER_PAGE_LABEL'];
            this.nextPageLabel = translations['NEXT_PAGE_LABEL'];
            this.previousPageLabel = translations['PREVIOUS_PAGE_LABEL'];
            this.firstPageLabel = translations['FIRST_PAGE_LABEL'];
            this.lastPageLabel = translations['LAST_PAGE_LABEL'];
            this.getRangeLabel = this.getRangeLabel.bind(this);

            this.changes.next();
        });
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
