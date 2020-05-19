import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService  } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { DetailsAPIComponent } from './components/api/details-api/details-api.component';
import { EditAPIComponent } from './components/api/edit-api/edit-api.component';
import { AddAPIComponent } from './components/api/add-api/add-api.component';
import { EditProviderComponent } from './components/provider/edit-provider/edit-provider.component';
import { DetailsProviderComponent } from './components/provider/details-provider/details-provider.component';
import { DetailsVersionComponent } from './components/version/details-version/details-version.component';
import { AddVersionComponent } from './components/version/add-version/add-version.component';
import { DetailsUserComponent } from './components/user/details-user/details-user.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { ApiSearchComponent } from './components/api/api-search/api-search.component';
import { ApiListComponent } from './components/api/api-list/api-list.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { RestApiItemComponent } from './components/api/api-search/rest-api-item/rest-api-item.component';
import { RestApiColumnItemComponent } from './components/api/rest-api-column-item/rest-api-column-item.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslatableComponent } from './components/shared/translatable/translatable.component';
import { environment } from 'src/environments/environment';
import { LinkProviderComponent } from './components/api/link-provider/link-provider.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { APIService } from './services/api.service';
import { VersionService } from './services/version.service';
import { UserService } from './services/user.service';
import { StorageService } from './services/local-storage.service';
import { ProviderService } from './services/provider.service';
import { ImgStorageService } from './services/img-storage.service';
import { HistoryContributionService } from './services/historyContribution.service';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeFr, 'fr');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DetailsAPIComponent,
    EditAPIComponent,
    AddAPIComponent,
    EditProviderComponent,
    DetailsProviderComponent,
    DetailsVersionComponent,
    AddVersionComponent,
    DetailsUserComponent,
    LoginComponent,
    RegisterComponent,
    ListUserComponent,
    ApiSearchComponent,
    ApiListComponent,
    RestApiItemComponent,
    RestApiColumnItemComponent,
    EditUserComponent,
    TranslatableComponent,
    LinkProviderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.FIRE_CONFIG),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularMaterialModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgbModalModule,
    Ng2ImgMaxModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  providers: [
    AuthService,
    APIService,
    VersionService,
    ProviderService,
    HistoryContributionService,
    UserService,
    AuthService,
    ImgStorageService,
    StorageService,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
