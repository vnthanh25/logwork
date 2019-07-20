import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Injectable()
export class ActivityEditResolver implements Resolve<any> {
    COLLECTION = 'activities';

    constructor(public firebaseService: FirebaseService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return new Promise((resolve, reject) => {
            const id = route.paramMap.get('id');
            this.firebaseService.getDocument(this.COLLECTION, id)
            .subscribe(
                result => {
                    resolve({ id: result.payload.id, ... result.payload.data() });
                }
            );
        });
    }
}
