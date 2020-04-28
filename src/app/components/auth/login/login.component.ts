import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  name: string;
  errorMessage: string;
  errorAlert: HTMLDivElement;

  constructor(public authService: AuthService, private router: Router) {
    if(this.authService.getCurrentUser() != null) {
      this.name = this.authService.getCurrentUser().username;
    }
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
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
    this.authService.login(name, password).then(data => {
      form.reset();
      this.name = name;
      this.errorMessage = data;
    }).catch((error) => {
      
      this.errorMessage = error;
    });
  }
}
