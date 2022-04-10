import { Injectable } from "@angular/core";
import { FirebaseService } from './firebase.service';
import { EncryptService } from './encrypt.service';

@Injectable({providedIn: 'root'})
export class ProjectService {
    private COLLECTION = 'projects';
    public projects: any[];
    constructor(
        private firebaseService: FirebaseService,
        private encryptService: EncryptService
    ) {
        this.getAll();
    }

    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.projects) {
                this.firebaseService.getDocuments(this.COLLECTION).subscribe(result => {
                    const projects = [];
                    this.projects = projects;
                    resolve(this.projects);
                });
            } else {
                resolve(this.projects);
            }
        });
    }
}
