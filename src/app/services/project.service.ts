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
                    result.forEach((item) => {
                        let name = item.payload.doc.data()['name'];
                        //console.log(name);
                        //name = this.encryptService.encrypt(name);
                        //console.log(name);
                        projects.push({id: item.payload.doc.id, name: this.encryptService.decrypt(name)});
                    });
                    this.projects = projects;
                    resolve(this.projects);
                });
            } else {
                resolve(this.projects);
            }
        });
    }
}
