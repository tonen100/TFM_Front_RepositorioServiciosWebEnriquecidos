import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageService } from 'src/app/services/local-storage.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends TranslatableComponent implements AfterViewInit {

  currentUser: User;
  activeRole: string;
  registrationForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  roles = ['Administrator', 'Contributor'];

  constructor(
    public translateService: TranslateService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private fireAuth: AngularFireAuth,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
      this.createForm();
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser) {
        this.activeRole = this.currentUser.role.toString();
        if (this.activeRole === 'Contributor') {
          router.navigate(['']);
        }
      }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
    }
  }

  createForm() {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      role: ['Contributor', Validators.required],
      validated: ['true']
    }, {validators: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('passwordConfirm').value;
    return pass === confirmPass ? null : { notSame: true };
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

  onRegister() {
    if (this.currentUser) {
      this.userService.postUser(this.registrationForm.value).then((_) => {
        this.registrationForm.reset();
        this.router.navigate(['']);
      });
    } else {
      this.userService.getUserByName(this.registrationForm.value.username).then(users => {
        if (users.length === 0) {
          this.userService.getUserByEmail(this.registrationForm.value.email).then(users2 => {
            if (users2.length === 0) {
              this.authService.register(this.registrationForm.value)
              .then(res => {
                this.registrationForm.reset();
                this.router.navigate(['']);
                this.toastr.success(this.translateService.instant('auth.succes_registration'));
              }, error => this.showError(this.translateService.instant('user.errors.fail_create_user')));
            } else { this.showError(this.translateService.instant('user.errors.already_exist_email')); }
          }).catch(_ => this.showError(this.translateService.instant('user.errors.server_inaccessible')));
        } else { this.showError(this.translateService.instant('user.errors.already_exist_name')); }
      }).catch(_ => this.showError(this.translateService.instant('user.errors.server_inaccessible')));
    }
  }
}
