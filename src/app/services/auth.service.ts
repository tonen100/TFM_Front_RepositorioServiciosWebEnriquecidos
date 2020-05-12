import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { AngularFireAuth } from '@angular/fire/auth';

import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';
import { StorageService } from './local-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User;
  private idToken: string;

  constructor(private fireAuth: AngularFireAuth,
              private http: HttpClient,
              private userService: UserService,
              private storageService: StorageService) {}

  init() {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  register(user: User) {
    return new Promise<any>((resolve, reject) => {
      this.userService.postUser(user).then(newUser => {
        return this.login(user.username, user.password).then(res => resolve(res)).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  login(login: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.userService.postLogin(login, password).then(user => {
        this.fireAuth.auth.signInWithCustomToken(user.customToken)
        .then(_1 => {
          this.currentUser = user;
          this.storageService.setItem('currentUser', JSON.stringify(this.currentUser));
          this.fireAuth.auth.currentUser.getIdToken().then(idToken => {
            this.idToken = idToken;
            this.storageService.setItem('idToken', idToken);
            resolve(idToken);
          }, _ => resolve(''));
        }, _2 => resolve(''));
      }).catch(error => {
        reject(error);
      });
    });
  }

  logout() {
    return new Promise<any>((resolve, reject) => {
      this.storageService.removeItem('currentUser');
      this.storageService.removeItem('idToken');
      this.fireAuth.auth.signOut()
        .then(_ => {
          this.currentUser = null;
          resolve();
        }).catch(error => {
          reject(error);
        });
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  loadIdToken() {
    this.idToken = localStorage.getItem('idToken');
    return this.idToken;
  }

  getIdToken() {
    return this.idToken;
  }

  checkRole(roles: string): boolean {
    return true;
    /*let result = false;
    if (this.currentUser) {
      if (roles.indexOf(this.currentUser.role.toString()) !== -1) {
        result = true;
      } else {
        result = false;
      }
    } else {
      if (roles.indexOf('anonymous') !== -1) {
        result = true;
      } else {
        result = false;
      }
    }
    return result;*/
  }
}
