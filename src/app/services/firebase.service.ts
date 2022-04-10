import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const userUrl = 'assets/data/user.json';
const usersUrl = 'assets/data/users.json';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient) {}

  getAvatars() {
  }

  // save(user: any) {
  //     return new Promise((resolve, reject) => {
  //         if(user.key) {
  //         this.db.collection(this.PATH).
  //                 .update(user.key, ({ name: user.name }))
  //                 .then(() => resolve())
  //                 .catch((e) => reject(e))
  //         } else {
  //         this.db.list(this.PATH)
  //                 .push({ name: user.name })
  //                 .then(() => resolve())
  //         }
  //     });
  // }

  createDocument(collection: string, document: any) {
    return this.http.get<Object>(userUrl).toPromise();
  }

  getDocument(collection: string, id) {
    return this.http.get<Object>(userUrl);
  }

  updateDocument(collection: string, id, value) {
    return this.http.get<Object>(userUrl).toPromise();
  }

  deleteDocument(collection: string, id: any) {
    return this.http.get<Object>(userUrl).toPromise();
  }

  getDocuments(collection: string) {
    return this.http.get<Object[]>(usersUrl);
  }

  // searchDocuments(collection: string, searchValue) {
  //   return this.db.collection(collection, ref => ref.where('nameToSearch', '>=', searchValue)
  //     .where('nameToSearch', '<=', searchValue + '\uf8ff'))
  //     .snapshotChanges();
  // }

  searchDocumentsByProperty(collection: string, property: string, value) {
    //return this.db.collection(collection,ref => ref.orderBy(property).startAt(value)).snapshotChanges();
    return this.http.get<Object[]>(usersUrl);
  }

  searchDocumentsByStartAtProperty(collection: string, property: string, value) {
    return this.http.get<Object[]>(usersUrl);
  }

}
