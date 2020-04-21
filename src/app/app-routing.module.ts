import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsUserComponent } from './components/user/details-user/details-user.component';
import { ListUserComponent } from './components/user/list-user/list-user.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { DetailsAPIComponent } from './components/api/details-api/details-api.component';
import { AddAPIComponent } from './components/api/add-api/add-api.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';
import { AddVersionComponent } from './components/version/add-version/add-version.component';
import { DetailsVersionComponent } from './components/version/details-version/details-version.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ApiSearchComponent } from './components/api/api-search/api-search.component';
import { LinkProviderComponent } from './components/api/link-provider/link-provider.component';
import { DetailsProviderComponent } from './components/provider/details-provider/details-provider.component';
import { EditProviderComponent } from './components/provider/edit-provider/edit-provider.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: ListUserComponent },
  { path: 'user/add', component: AddUserComponent },
  { path: 'user/:id', component: DetailsUserComponent },
  { path: 'user/:id/edit', component: EditUserComponent },
  { path: 'apis/searchResults', component: ApiSearchComponent },
  { path: 'api/add', component: AddAPIComponent },
  { path: 'api/:id', component: DetailsAPIComponent },
  { path: 'api/:id/edit', component: EditUserComponent },
  { path: 'api/:id/provider/link', component: LinkProviderComponent },
  { path: 'version/add', component: AddVersionComponent },
  { path: 'version/:id', component: DetailsVersionComponent },
  { path: 'provider/:id', component: DetailsProviderComponent },
  { path: 'provider/:id/edit', component: EditProviderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
