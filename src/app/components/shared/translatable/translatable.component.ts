import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-translatable',
  templateUrl: './translatable.component.html',
  styleUrls: ['./translatable.component.css']
})
export class TranslatableComponent {

  lang: string;

  constructor(
    private translate: TranslateService
    ) {}

  initTranslate() {
    if (!this.lang) {
      this.lang = this.getLanguage();
    }
    this.changeLanguage(this.lang);
  }

  changeLanguage(language: string) {
    this.lang = language;
    this.translate.use(language);
    moment.locale(language);
    localStorage.setItem('language', language);
  }

  getLanguage() {
    return this.lang ? this.lang : localStorage.getItem('language') ?  localStorage.getItem('language') : 'en';
  }
}
