import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { API } from 'src/app/models/api';
import { businessModels } from '../business-models.enum';
declare var jQuery: any;

@Component({
  selector: 'app-api-search',
  templateUrl: './api-search.component.html',
  styleUrls: ['./api-search.component.css']
})
export class ApiSearchComponent implements OnInit {

  keywords: string;
  restApis: API[];
  businessModels = businessModels;
  selectedBusinessModels = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public apiService: APIService
    ) {
  }

  ngOnInit(): void {
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

  filterByBusinessModel(api: API): boolean {
    return api.businessModels == null || api.businessModels.length === 0 || this.selectedBusinessModels.length == 0 ||
    this.selectedBusinessModels.filter(businessModel => api.businessModels.includes(businessModel)).length > 0;
  }

  onClickAPI(api: API) {
    this.router.navigate(['api', api._id]);
  }

}
