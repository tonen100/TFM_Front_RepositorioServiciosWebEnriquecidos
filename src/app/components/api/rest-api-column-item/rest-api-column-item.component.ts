import { Component, Input } from '@angular/core';
import { API } from '../../../models/api';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';

@Component({
  selector: 'app-rest-api-column-item',
  templateUrl: './rest-api-column-item.component.html',
  styleUrls: ['./rest-api-column-item.component.css']
})
export class RestApiColumnItemComponent extends TranslatableComponent {

  @Input() restApi: API;
  @Input() showDescription: boolean;

  constructor(
    public translateService: TranslateService
  ) {
    super(translateService);
  }

}
