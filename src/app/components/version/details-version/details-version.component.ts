import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Version } from 'src/app/models/version';

declare let Redoc: any;

@Component({
  selector: 'app-details-version',
  templateUrl: './details-version.component.html',
  styleUrls: ['./details-version.component.css']
})
export class DetailsVersionComponent implements AfterViewInit, OnChanges {

  @Input() version: Version;

  constructor() { }

  ngAfterViewInit(): void {
    this.attachDocumentationComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.attachDocumentationComponent();
  }

  attachDocumentationComponent() {
    const elem = document.getElementById('doc_container');
    Redoc.init(JSON.parse(this.version.oasDocumentation), {}, elem);
  }

}
