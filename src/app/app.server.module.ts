import { NgModule, PLATFORM_ID } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UniversalTranslateLoader } from '@ngx-universal/translate-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function translateFactory(platformId: any, http: HttpClient) {
  const browserLoader = new TranslateHttpLoader(http);
  return new UniversalTranslateLoader(platformId, browserLoader, 'dist/api-repository/browser/assets/i18n', '.json');
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    TranslateModule.forRoot({
      loader: {
       provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [PLATFORM_ID, HttpClient]
      }
   })
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
