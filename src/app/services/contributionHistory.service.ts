import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ContributionHistory } from '../models/contributionHistory';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ContributionHistoryService {

  DEFAULT_LANG = environment.DEFAULT_LANG;
  lang: string;
  token: string;
  contributionHistoryRole: string;
  private URL_API = environment.URL_API;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute) {
          this.route.queryParams.subscribe(params => {
              this.lang = params.lang != null ? params.lang : this.DEFAULT_LANG;
              httpOptions.headers = httpOptions.headers.set('Accept-language', this.lang);
          });
  }

  getAllContributionsHistoryByContribution(contributionId: string, typeContribution: 'API' | 'Version' | 'Provider') {
    const url = `${this.URL_API}/v1/contributionHistorys?contributionId=${contributionId}&typeContribution=${typeContribution}`;
    return this.http.get<Array<ContributionHistory>>(url).toPromise();
  }

  getAllContributionsHistoryByContributor(contributorId: string) {
    const url = `${this.URL_API}/v1/contributionHistorys?contributorId=${contributorId}`;
    return this.http.get<Array<ContributionHistory>>(url).toPromise();
  }

  getContributionHistory(id: string) {
    const url = `${this.URL_API}/v1/contributionHistorys/${id}`;
    return this.http.get<ContributionHistory>(url).toPromise();
  }
}
