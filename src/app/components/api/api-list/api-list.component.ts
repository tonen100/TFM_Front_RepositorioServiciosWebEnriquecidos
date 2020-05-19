import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { API } from 'src/app/models/api';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css']
})
export class ApiListComponent extends TranslatableComponent implements OnInit {

  alphabet = [];
  selectedLetter: string;
  restApisByLetter: Map<string, API[]>;

  constructor(
    public translateService: TranslateService,
    private apiService: APIService,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
    }

  ngOnInit(): void {
    this.apiService.getApisList().then(apis => {
      this.groupByLetter(apis);
    });
  }

  groupByLetter(apis: API[]) {
    this.alphabet = [];
    this.restApisByLetter = new Map<string, API[]>();
    apis.forEach(api => {
      const firstLetter = api.name.slice(0, 1).toUpperCase();
      if (this.restApisByLetter.get(firstLetter)) {
        this.restApisByLetter.get(firstLetter).push(api);
      } else {
        this.restApisByLetter.set(firstLetter, [ api ]);
      }
    });
    for (const key of this.restApisByLetter.keys()) {
      this.alphabet.push(key);
      this.restApisByLetter.set(key, this.restApisByLetter.get(key).sort((a, b) => a.name < b.name ? -1 : 1));
    }
    this.alphabet = this.alphabet.sort((a, b) => a < b ? -1 : 1);
    this.selectedLetter = this.alphabet[0];
  }

  changeSelection(letter) {
    this.selectedLetter = letter;
  }

}
