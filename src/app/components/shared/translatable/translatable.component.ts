import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-translatable',
  templateUrl: './translatable.component.html',
  styleUrls: ['./translatable.component.css']
})
export class TranslatableComponent {

  lang: string;

  constructor(private translate: TranslateService) {}

  initTranslate() {
    if (!this.lang) {
      this.lang = this.getLanguage();
      console.log(this.lang)
    }
    console.log(this.lang)
    this.translate.setDefaultLang(this.lang);
    this.changeLanguage(this.lang);
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    moment.locale(language);
    localStorage.setItem('language', language);
  }

  getLanguage() {
    return localStorage.getItem('language') ?  localStorage.getItem('language') : 'en';
  }

}
