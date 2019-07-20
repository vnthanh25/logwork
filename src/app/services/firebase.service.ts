import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getAvatars(){
      return this.db.collection('/avatar').valueChanges()
  }

  createDocument(collection: string, document: any) {
    return this.db.collection(collection).add(document);
  }

  getDocument(collection: string, id){
    return this.db.collection(collection).doc(id).snapshotChanges();
  }

  updateDocument(collection: string, id, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection(collection).doc(id).set(value);
  }

  deleteDocument(collection: string, id: any){
    return this.db.collection(collection).doc(id).delete();
  }

  getDocuments(collection: string){
    return this.db.collection(collection).snapshotChanges();
  }

  searchDocuments(collection: string, searchValue){
    return this.db.collection(collection,ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }

  searchDocumentsByProperty(collection: string, property: string, value){
    //return this.db.collection(collection,ref => ref.orderBy(property).startAt(value)).snapshotChanges();
    return this.db.collection(collection,ref => ref.where(property, '==', value)).snapshotChanges();
  }

}
