import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from '../shared/translatable/translatable.component';
import { AuthService } from 'src/app/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../../assets/lang/lang.css']
})
export class HeaderComponent extends TranslatableComponent implements OnInit {

  faSearch = faSearch;
  faUserCircle = faUserCircle;

  idMainAPI = environment.ID_MAIN_API_IN_API;
  lang: string;
  token: string;
  currentUser: User;
  activeRole = 'anonymous';

  keywords = '';

  constructor(
    private title: Title,
    private meta: Meta,
    public translateService: TranslateService,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId
  ) {
    super(translateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTranslate();
      this.lang = super.getLanguage();
      this.authService.init().then(() => {
        this.token = this.authService.getIdToken();
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
          this.activeRole = this.currentUser.role.toString();
        }
      });
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.title.setTitle('RestAPImantics');
          this.meta.updateTag({name: 'description', content: '' });
          if (event.url === '/') {
            this.currentUser = this.authService.getCurrentUser();
            if (this.currentUser) {
              this.activeRole = this.currentUser.role.toString();
            }
          }
        }
      });
    }
  }

  changeLanguage(language: string) {
    super.changeLanguage(language);
    this.lang = super.getLanguage();
  }

  onLogout() {
    this.authService.logout()
      .then(
        () => {
          this.currentUser = null;
          this.token = null;
          localStorage.removeItem('idToken');
          this.router.navigate(['']);
          this.toastr.success(this.translateService.instant('auth.success_disconnection'));
        }
      );
  }

  searchAPIs() {
    if (this.keywords.length >= 2) {
      this.router.navigate(['/apis/searchResults'], {
        queryParams: { keywords: this.keywords }
      });
    }
  }

}
