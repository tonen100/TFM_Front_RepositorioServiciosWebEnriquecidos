import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Provider } from '../models/provider';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

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

  getAllProviders() {
    const url = `${this.URL_API}/v1/providers`;
    return this.http.get<Array<Provider>>(url).toPromise();
  }

  getProvidersByName(name: string) {
    const url = `${this.URL_API}/v1/providers?name=${name}`;
    return this.http.get<Array<Provider>>(url).toPromise();
  }

  postProvider(provider: Provider) {
    const url = `${this.URL_API}/v1/providers`;
    const postProvider = JSON.parse(JSON.stringify(provider));
    delete postProvider._id;

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.post<Provider>(url, postProvider, httpOptions).toPromise();
  }

  getProvider(id: string) {
    const url = `${this.URL_API}/v1/providers/${id}`;
    return this.http.get<Provider>(url).toPromise();
  }

  updateProvider(provider: Provider) {
    const url = `${this.URL_API}/v1/providers/${provider._id}`;

    const putProvider = JSON.parse(JSON.stringify(provider));
    delete putProvider.customToken;

    const body = JSON.stringify(putProvider);

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.put<Provider>(url, body, httpOptions).toPromise();
  }

  deleteProvider(id: string) {
    const url = `${this.URL_API}/v1/providers/${id}`;

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    return this.http.delete(url, httpOptions).toPromise();
  }

  blacklistProvider(provider: Provider, blacklisted: boolean = true) {
    const url = `${this.URL_API}/v1/providers/${provider._id}/blacklist`;
    const body = JSON.stringify({ blacklisted });

    const idToken = this.authService.getIdToken();

    if (idToken != null) {
      httpOptions.headers = httpOptions.headers.set('Authorization', idToken);
    } else if (httpOptions.headers.get('Authorization') != null) {
      httpOptions.headers = httpOptions.headers.delete('Authorization');
    }

    this.http.patch<Provider>(url, body, httpOptions).toPromise();
  }

  unblacklistProvider(provider: Provider) {
    return this.blacklistProvider(provider, false);
  }
}
