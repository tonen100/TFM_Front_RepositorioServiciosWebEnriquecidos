import { Component, OnInit, Input } from '@angular/core';
import { API } from '../../../../models/api';

@Component({
  selector: 'app-rest-api-item',
  templateUrl: './rest-api-item.component.html',
  styleUrls: ['./rest-api-item.component.css']
})
export class RestApiItemComponent implements OnInit {

  @Input() restApi: API;

  constructor() { }

  ngOnInit(): void {

  }

  extractCategories(restApi: API) {
    return restApi.metadata.category != null ?
      typeof restApi.metadata.category === 'string' ?
        restApi.metadata.category : restApi.metadata.category.join(', ') : '';
  }

}
