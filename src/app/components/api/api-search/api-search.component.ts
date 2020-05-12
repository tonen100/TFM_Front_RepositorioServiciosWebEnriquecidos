import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { API } from 'src/app/models/api';
import { businessModels } from '../business-models.enum';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-api-search',
  templateUrl: './api-search.component.html',
  styleUrls: ['./api-search.component.css']
})
export class ApiSearchComponent extends TranslatableComponent implements OnInit {

  keywords: string;
  restApis: API[];
  businessModels = businessModels;
  selectedBusinessModels = [];

  constructor(
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public apiService: APIService,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.keywords = params.keywords;
        this.apiService.searchApis(this.keywords, 0, null)
        .then(restApis => {
          document.getElementById('loadingSpinner').style.display = 'none';
          this.restApis = restApis;
          jQuery('#SelectPicker').selectpicker();
        })
        .catch(err => document.getElementById('loadingSpinner').style.display = 'none');
      });
    }
  }

  filterByBusinessModel(api: API): boolean {
    return api.businessModels == null || api.businessModels.length === 0 || this.selectedBusinessModels.length === 0 ||
    this.selectedBusinessModels.filter(businessModel => api.businessModels.includes(businessModel)).length > 0;
  }

  onClickAPI(api: API) {
    this.router.navigate(['api', api._id]);
  }

}
