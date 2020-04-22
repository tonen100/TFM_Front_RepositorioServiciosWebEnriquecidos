import { Injectable } from '@angular/core';
import { API } from '../models/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Version } from '../models/version';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  DEFAULT_LANG = environment.DEFAULT_LANG;
  lang: string;
  token: string;
  userRole: string;
  private URL_API = environment.URL_API;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService
    ) {
      this.route.queryParams.subscribe(params => {
          this.lang = params.lang != null ? params.lang : this.DEFAULT_LANG;
          httpOptions.headers = httpOptions.headers.set('Accept-language', this.lang);
      });
  }

  getAllVersions(api: API) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions`;
    return this.http.get<Array<Version>>(url).toPromise();
  }

  postVersion(api: API, version: Version) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions`;
    const postVersion = JSON.parse(JSON.stringify(version));
    delete postVersion._id;
    const idToken = this.authService.getIdToken();

    if(idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if(httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.post<Version>(url, postVersion, httpOptions).toPromise();
  }

  getVersion(id: string, version: Version) {
    const url = `${this.URL_API}/v1/restApis/${id}/versions/${version._id}`;
    return this.http.get<Version>(url).toPromise();
  }

  getMetadata(originalDocumentation: string) {
    const url = `${this.URL_API}/v1/restApis/versions/generateMetadata`;
    return this.http.post<Version>(url, { originalDocumentation }, httpOptions).toPromise();
  }

  updateVersion(api: API, version: Version) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions/${version._id}`;

    const putVersion = JSON.parse(JSON.stringify(version));

    const body = JSON.stringify(putVersion);

    const idToken = this.authService.getIdToken();

    if(idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if(httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization')
    }

    this.http.put<Version>(url, body, httpOptions).toPromise();
  }

  depreciateVersion(api: API, version: Version, deprecated: boolean = true) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions/${version._id}/deprecate`;
    const body = JSON.stringify({ deprecated });

    const idToken = this.authService.getIdToken();

    if(idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if(httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization')
    }

    this.http.patch<Version>(url, body, httpOptions).toPromise();
  }

  blacklistVersion(api: API, version: Version, blacklisted: boolean = true) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions/${version._id}/blacklist`;
    const body = JSON.stringify({ blacklisted });

    const idToken = this.authService.getIdToken();

    if(idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if(httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    this.http.patch<Version>(url, body, httpOptions).toPromise();
  }

  unblacklistVersion(api: API, version: Version) {
    return this.blacklistVersion(api, version, false);
  }

  deleteVersion(api: API, id: string) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/versions/${id}/`;

    const idToken = this.authService.getIdToken();

    if(idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if(httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.delete<Version>(url, httpOptions).toPromise();
  }
}
