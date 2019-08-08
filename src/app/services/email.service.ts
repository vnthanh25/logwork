import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmailService {
    constructor(private http: HttpClient) {
    }

    send(data: any) {
        return this.http.post('https://logworkmailserver.herokuapp.com', data);
    }
}
