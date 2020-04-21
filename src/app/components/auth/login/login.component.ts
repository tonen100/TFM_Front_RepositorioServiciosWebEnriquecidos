import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string;
  errorMessage: string;

  constructor(public authService: AuthService, private router: Router) {
    if(this.authService.getCurrentUser() != null) {
      this.name = this.authService.getCurrentUser().username;
    }
  }

  onLogin(form: NgForm) {
    const name = form.value.name;
    const password = form.value.password;
    this.authService.login(name, password).then(data => {
      form.reset();
      this.name = name;
      this.errorMessage = data;
    }).catch((error) => {
      console.log(error);
      this.errorMessage = error;
    });
  }
}
