import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class ImgStorageService {

    storageRef: firebase.storage.Reference;

  constructor(private afStorage: AngularFireStorage) {
    this.storageRef = this.afStorage.storage.ref();
  }

  async uploadImage(img, path, name) {
    const imageRef = this.storageRef.child(path + '/images/' + name);
    const snapshot = await imageRef.put(img);
    console.log('Uploaded a blob or file!');
    return imageRef.getDownloadURL();
  }
}
