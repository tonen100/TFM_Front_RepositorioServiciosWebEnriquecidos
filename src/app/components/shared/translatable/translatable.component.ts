import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-translatable',
  templateUrl: './translatable.component.html',
  styleUrls: ['./translatable.component.css']
})
export class TranslatableComponent {

  constructor(private translate: TranslateService) {}

  initTranslate() {
    let lang = localStorage.getItem('language');
    if (lang === 'null') {
      lang = 'en';
    }
    this.translate.setDefaultLang(lang);
    this.changeLanguage(lang);
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    moment.locale(language);
    localStorage.setItem('language', language);
  }

  getLanguage() {
    return localStorage.getItem('language');
  }

}
