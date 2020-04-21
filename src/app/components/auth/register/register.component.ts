import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm: FormGroup;
  errorMessage: string;
  roleList = ['Administrator', 'Contributor'];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private fireAuth: AngularFireAuth,
    private storageService: StorageService
    ) {
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      passwordConfirm: ['', Validators.required],
      role: ['Contributor'],
      validated: ['true']
    }, {validators: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('passwordConfirm').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onRegister() {
    this.authService.register(this.registrationForm.value)
      .then(res => {
        console.log(res);
        this.fireAuth.auth.currentUser.getIdToken()
          .then((token: string) => {
              this.storageService.setItem('idToken', token);
              this.toastr.success(this.translateService.instant('message.registered'));
            });
        this.registrationForm.reset();
        this.router.navigate(['']);
      }, error => {
        console.log(error);
        this.errorMessage = error;
      });
  }
}