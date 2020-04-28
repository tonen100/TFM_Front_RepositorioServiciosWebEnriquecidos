import { Component, OnInit } from '@angular/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-api',
  templateUrl: './edit-api.component.html',
  styleUrls: ['./edit-api.component.css']
})
export class EditAPIComponent extends TranslatableComponent implements OnInit {

  constructor(
    public translateService: TranslateService
  ) {
    super(translateService);
  }

  ngOnInit(): void {
  }

}
