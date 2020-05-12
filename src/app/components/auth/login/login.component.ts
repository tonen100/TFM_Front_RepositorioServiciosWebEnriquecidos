import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends TranslatableComponent implements AfterViewInit {
  name: string;
  errorMessage: string;
  errorAlert: HTMLDivElement;

  constructor(
    public translateService: TranslateService,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
      if (this.authService.getCurrentUser() != null) {
        this.name = this.authService.getCurrentUser().username;
      }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
    }
  }

  showError(message: string) {
    this.hideError();
    this.errorMessage = message;
    this.errorAlert.style.display = 'block';
    this.errorAlert.classList.add('show');
  }

  hideError() {
    this.errorMessage = null;
    this.errorAlert.style.display = 'none';
    this.errorAlert.classList.remove('show');
  }

  onLogin(form: NgForm) {
    const name = form.value.name;
    const password = form.value.password;
    this.authService.login(name, password).then(res => {
      form.reset();
      this.name = name;
      this.router.navigate(['']);
      this.toastr.success(this.translateService.instant('auth.success_connection'));
    }, err => this.showError(this.translateService.instant('auth.wrong_login_or_password')));
  }
}
