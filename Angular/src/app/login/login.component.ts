import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private loginAuth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  isUserValid: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  });

  loginSubmited() {
    this.loginAuth
      .loginUser([
        this.loginForm.value.email ? this.loginForm.value.email : '',
        this.loginForm.value.pwd || '',
      ])
      .subscribe({
        next: (res) => {
          this.isUserValid = true;
          alert('Login Success');
          this.router.navigateByUrl('/users');
        },
        error: (err) => {
          this.isUserValid = false;
          alert('Login Unsuccessful');
        },
      });
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
