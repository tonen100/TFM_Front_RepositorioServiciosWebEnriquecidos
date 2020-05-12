import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  DEFAULT_LANG = environment.DEFAULT_LANG;
  lang: string;
  token: string;
  userRole: string;
  private URL_API = environment.URL_API;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute) {
          this.route.queryParams.subscribe(params => {
              this.lang = params.lang != null ? params.lang : this.DEFAULT_LANG;
              httpOptions.headers = httpOptions.headers.set('Accept-language', this.lang);
          });
  }

  postLogin(login: string, password: string) {
    const url = `${this.URL_API}/v1/login`;
    return this.http.post<User>(url, {
      login,
      password
    }).toPromise();
  }

  postUser(user: User) {
    const url = `${this.URL_API}/v1/users`;
    const postUser = JSON.parse(JSON.stringify(user));
    delete postUser._id;
    return this.http.post<User>(url, postUser).toPromise();
  }

  postUserByAdmin(user: User) {
    const url = `${this.URL_API}/v1/users/admin`;
    const postUser = JSON.parse(JSON.stringify(user));
    delete postUser._id;
    return this.http.post<User>(url, postUser).toPromise();
  }

  getUser(id: string) {
    const url = `${this.URL_API}/v1/users/${id}`;
    return this.http.get<User>(url).toPromise();
  }

  getUserByName(name: string) {
    const url = `${this.URL_API}/v1/users?username=` + name;
    return this.http.get<User[]>(url).toPromise();
  }

  getUserByEmail(email: string) {
    const url = `${this.URL_API}/v1/users?email=` + email;
    return this.http.get<User[]>(url).toPromise();
  }

  updateProfile(user: User, idToken: string) {
    const url = `${this.URL_API}/v1/users/${user._id}`;

    const putUser = JSON.parse(JSON.stringify(user));
    delete putUser.customToken;

    const body = JSON.stringify(putUser);
    httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    return this.http.put<User>(url, body, httpOptions).toPromise();
  }

  banUser(id: string, banned: boolean) {
    const url = `${this.URL_API}/v1/users/${id}/ban`;
    return this.http.patch<User>(url, { banned }).toPromise();
  }
}
