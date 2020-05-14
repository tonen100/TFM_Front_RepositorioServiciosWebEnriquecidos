import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryContributionService } from 'src/app/services/historyContribution.service';
import { TranslatableComponent } from '../shared/translatable/translatable.component';
import { API } from 'src/app/models/api';
import { APIService } from 'src/app/services/api.service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  restApis: API[] = [];
  errorMessage: string;
  errorAlert: HTMLDivElement;

  constructor(
    public translateService: TranslateService,
    public apiService: APIService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    super(translateService);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.apiService.getMostRecentAPIs(4)
        .then(apis => this.restApis = apis)
        .catch(_ => this.showError(this.translateService.instant('api.errors.server_inaccessible')));
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
    }
  }

  showError(message: string) {
    this.hideError();
    this.errorMessage = message;
    this.errorAlert.style.display = 'block';
    this.errorAlert.classList.add('show');
  }

  hideError() {
    this.errorMessage = null;
    this.errorAlert.style.display = 'none';
    this.errorAlert.classList.remove('show');
  }

}
