import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class StorageService {

  private storageSub = new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next('changed');
  }

  removeItem(key) {
    localStorage.removeItem(key);
    if (key === 'idToken') {
      localStorage.removeItem('currentUser');
    }
    this.storageSub.next('changed');
  }
}
