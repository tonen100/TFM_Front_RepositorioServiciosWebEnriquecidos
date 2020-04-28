import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HistoryContribution } from '../models/historyContribution';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HistoryContributionService {

  DEFAULT_LANG = environment.DEFAULT_LANG;
  lang: string;
  token: string;
  historyContributionRole: string;
  private URL_API = environment.URL_API;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute) {
          this.route.queryParams.subscribe(params => {
              this.lang = params.lang != null ? params.lang : this.DEFAULT_LANG;
              httpOptions.headers = httpOptions.headers.set('Accept-language', this.lang);
          });
  }

  getAllhistoryContributionsByContribution(contributionId: string, typeContribution: 'RestAPI' | 'Version' | 'Provider') {
    const url = `${this.URL_API}/v1/historyContributions?contributionId=${contributionId}&typeContribution=${typeContribution}`;
    return this.http.get<Array<HistoryContribution>>(url).toPromise();
  }

  getAllhistoryContributionsByContributor(contributorId: string) {
    const url = `${this.URL_API}/v1/historyContributions?contributorId=${contributorId}`;
    return this.http.get<Array<HistoryContribution>>(url).toPromise();
  }

  getHistoryContribution(id: string) {
    const url = `${this.URL_API}/v1/historyContributions/${id}`;
    return this.http.get<HistoryContribution>(url).toPromise();
  }
}
