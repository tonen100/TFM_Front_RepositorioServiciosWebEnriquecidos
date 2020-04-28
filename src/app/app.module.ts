import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader  } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';

import { StopPropagationDirective } from './directives/stop-propagation.directive';

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
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { DetailsUserComponent } from './components/user/details-user/details-user.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { ApiSearchComponent } from './components/api/api-search/api-search.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { RestApiItemComponent } from './components/api/api-search/rest-api-item/rest-api-item.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslatableComponent } from './components/shared/translatable/translatable.component';
import { environment } from 'src/environments/environment';
import { LinkProviderComponent } from './components/api/link-provider/link-provider.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    AddUserComponent,
    DetailsUserComponent,
    LoginComponent,
    RegisterComponent,
    ListUserComponent,
    ApiSearchComponent,
    RestApiItemComponent,
    EditUserComponent,
    TranslatableComponent,
    LinkProviderComponent,
    StopPropagationDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.FIRE_CONFIG),
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
    NgbModalModule
  ],
  providers: [AngularFireAuth, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
