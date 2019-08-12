import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventProvider {
    eventLogined = new EventEmitter<any>();
}
