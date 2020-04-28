import { Component, OnInit, Input } from '@angular/core';
import { API } from '../../../../models/api';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from 'src/app/components/shared/translatable/translatable.component';

@Component({
  selector: 'app-rest-api-item',
  templateUrl: './rest-api-item.component.html',
  styleUrls: ['./rest-api-item.component.css']
})
export class RestApiItemComponent extends TranslatableComponent implements OnInit {

  @Input() restApi: API;

  constructor(
    public translateService: TranslateService
  ) {
    super(translateService);
  }

  ngOnInit(): void {

  }

  extractCategories(restApi: API) {
    return restApi.metadata.category != null ?
      typeof restApi.metadata.category === 'string' ?
        restApi.metadata.category : restApi.metadata.category.join(', ') : '';
  }

}
