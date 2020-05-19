import { Injectable } from '@angular/core';
import { API } from '../models/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Provider } from '../models/provider';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class APIService {

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
          httpOptions.headers = httpOptions.headers.set('accept-language', this.lang);
      });
  }

  getApisList() {
    const url = `${this.URL_API}/v1/restApis?all=true`;
    return this.http.get<Array<API>>(url).toPromise();
  }

  searchApis(keywords: string, page: number = 0, businessModels: Array<string> = null) {
    const url = `${this.URL_API}/v1/restApis?keywords=${keywords}&page=${page}`
      + (businessModels != null ? businessModels.map(businessModel => '&businessModels=' + businessModel).join() : '');
    return this.http.get<Array<API>>(url).toPromise();
  }

  getApisByProvider(provider: Provider, page: number = 0) {
    const url = `${this.URL_API}/v1/restApis?providerId=${provider._id}&page=${page}`;
    return this.http.get<Array<API>>(url).toPromise();
  }

  getApisByName(name: string) {
    const url = `${this.URL_API}/v1/restApis?name=${name}`;
    return this.http.get<Array<API>>(url).toPromise();
  }

  getMostRecentAPIs(count: number) {
    const url = `${this.URL_API}/v1/restApis/recent?count=${count}`;
    return this.http.get<Array<API>>(url).toPromise();
  }

  postApi(api: API) {
    const url = `${this.URL_API}/v1/restApis`;
    const postApi = JSON.parse(JSON.stringify(api));
    delete postApi._id;
    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.post<API>(url, postApi, httpOptions).toPromise();
  }

  getApi(id: string) {
    const url = `${this.URL_API}/v1/restApis/${id}`;
    return this.http.get<API>(url).toPromise();
  }

  updateApi(api: API) {
    const url = `${this.URL_API}/v1/restApis/${api._id}`;

    const putApi = JSON.parse(JSON.stringify(api));

    const body = JSON.stringify(putApi);

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.put<API>(url, body, httpOptions).toPromise();
  }

  blacklistApi(api: API, blacklisted: boolean = true) {
    const url = `${this.URL_API}/v1/restApis/${api._id}/blacklist`;
    const body = JSON.stringify({ blacklisted });

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.patch<API>(url, body, httpOptions).toPromise();
  }

  unblacklistApi(api: API) {
    return this.blacklistApi(api, false);
  }

  linkApiToProvider(apiId: string, providerId: string) {
    const url = `${this.URL_API}/v1/restApis/${apiId}/link/${providerId}`;

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.patch<API>(url, {}, httpOptions).toPromise();
  }

  deleteApi(id: string) {
    const url = `${this.URL_API}/v1/restApis/${id}`;

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.delete(url, httpOptions).toPromise();
  }
}
