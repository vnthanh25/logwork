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
            const isCreate = route.paramMap.get('isCreate');
            this.firebaseService.getDocument(this.COLLECTION, id)
            .subscribe(
                result => {
                    const activity = { id: result.payload.id, ... result.payload.data() };
                    if (isCreate === 'true') {
                        activity['isCreate'] = isCreate;
                    }
                    resolve(activity);
                }
            );
        });
    }
}
