import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Version } from 'src/app/models/version';
import { isPlatformBrowser } from '@angular/common';

declare let Redoc: any;

@Component({
  selector: 'app-details-version',
  templateUrl: './details-version.component.html',
  styleUrls: ['./details-version.component.css']
})
export class DetailsVersionComponent implements AfterViewInit, OnChanges {

  @Input() version: Version;

  constructor(
    @Inject(PLATFORM_ID) private platformId
    ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.attachDocumentationComponent();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isPlatformBrowser(this.platformId)) {
      this.attachDocumentationComponent();
    }
  }

  attachDocumentationComponent() {
    const elem = document.getElementById('doc_container');
    Redoc.init(JSON.parse(this.version.oasDocumentation), {}, elem);
  }

}
