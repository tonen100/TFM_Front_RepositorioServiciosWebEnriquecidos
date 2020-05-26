import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { API } from 'src/app/models/api';
import { businessModels } from '../business-models.enum';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
declare var jQuery: any;

const COUNT_PER_PAGE = 5;

@Component({
  selector: 'app-api-search',
  templateUrl: './api-search.component.html',
  styleUrls: ['./api-search.component.css']
})
export class ApiSearchComponent extends TranslatableComponent {

  faArrowDown = faArrowDown;

  paramsSubscription: Subscription;
  keywords: string;
  restApis: API[];
  page: number;
  businessModels = businessModels;
  selectedBusinessModels = [];
  reachedEnd = false;

  constructor(
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public apiService: APIService,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
      if (isPlatformBrowser(this.platformId)) {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
          this.page = 0;
          this.keywords = params.keywords;
          this.apiService.searchApis(this.keywords, this.page, null)
          .then(restApis => {
            document.getElementById('loadingSpinner').style.display = 'none';
            if (document.getElementById('nextArrow')) {
              document.getElementById('nextArrow').style.display = 'block';
            }
            this.restApis = restApis;
            jQuery('#SelectPicker').selectpicker();
            if (restApis.length < COUNT_PER_PAGE ) { this.reachedEnd = true; }
          })
          .catch(err => document.getElementById('loadingSpinner').style.display = 'none');
        });
      }
  }

  searchNextResults(): void {
    document.getElementById('secondarySpinner').style.display = 'block';
    document.getElementById('nextArrow').style.display = 'none';
    this.page++;
    this.apiService.searchApis(this.keywords, this.page, this.selectedBusinessModels.length > 0 ? this.selectedBusinessModels : null)
    .then(restApis => {
      document.getElementById('secondarySpinner').style.display = 'none';
      document.getElementById('nextArrow').style.display = 'block';
      this.restApis = this.restApis.concat(restApis);
      jQuery('#SelectPicker').selectpicker();
      if (restApis.length < COUNT_PER_PAGE ) { this.reachedEnd = true; }
    }).catch(err => {
      document.getElementById('secondarySpinner').style.display = 'none';
      document.getElementById('nextArrow').style.display = 'block';
    });

  }

  filterByBusinessModel(api: API): boolean {
    return api.metadata == null || api.metadata.offers == null || api.metadata.offers.length === 0 ||
    this.selectedBusinessModels.length === 0 || this.selectedBusinessModels.filter(
      businessModel => api.metadata.offers.map(offer => offer.identifier).includes(businessModel)
    ).length > 0;
  }

  onClickAPI(api: API) {
    this.router.navigate(['api', api._id]);
  }

}
