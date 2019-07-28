import { MomentDateAdapter, MatMomentDateAdapterOptions } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

export class CustomDateAdapter extends MomentDateAdapter {

    parse(value: any, parseFormat: string | string[]): Moment | null {
        const dateFormat: string | string[] = localStorage.getItem('dateFormat') || parseFormat;
        return super.parse(value, dateFormat);
    }

    format(date: Moment, displayFormat: string): string {
        const dateFormat: string | string[] = localStorage.getItem('dateFormat') || displayFormat;
        return super.format(date, dateFormat);
    }

}
