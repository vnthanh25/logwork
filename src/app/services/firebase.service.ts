import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getAvatars() {
      return this.db.collection('/avatar').valueChanges();
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
    return this.db.collection(collection).add(document);
  }

  getDocument(collection: string, id) {
    return this.db.collection(collection).doc(id).snapshotChanges();
  }

  updateDocument(collection: string, id, value) {
    return this.db.collection(collection).doc(id).set(value, { merge: true });
  }

  deleteDocument(collection: string, id: any) {
    return this.db.collection(collection).doc(id).delete();
  }

  getDocuments(collection: string) {
    return this.db.collection(collection).snapshotChanges();
  }

  // searchDocuments(collection: string, searchValue) {
  //   return this.db.collection(collection, ref => ref.where('nameToSearch', '>=', searchValue)
  //     .where('nameToSearch', '<=', searchValue + '\uf8ff'))
  //     .snapshotChanges();
  // }

  searchDocumentsByProperty(collection: string, property: string, value) {
    //return this.db.collection(collection,ref => ref.orderBy(property).startAt(value)).snapshotChanges();
    return this.db.collection(collection, ref => ref.where(property, '==', value)).snapshotChanges();
  }

  searchDocumentsByStartAtProperty(collection: string, property: string, value) {
    return this.db.collection(collection, ref => ref.orderBy(property).startAt(value).endAt(value + '\uf8ff')).snapshotChanges();
  }

}
