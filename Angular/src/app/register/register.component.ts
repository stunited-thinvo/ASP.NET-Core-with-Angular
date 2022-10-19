import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[- +()0-9]+'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
    address:new FormControl('')
  });

  registerSubmit() {
    const { email, phone, name, password } = this.registerForm.value;
    this.authService.registerUser(email, phone, name, password).subscribe({
      next: (res) => {
        this.router.navigateByUrl('');
        alert('Success');
      },
      error: (err) => {
        alert(err.errors);
      },
    });
  }

  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get Name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }

  get Phone(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }

  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get Address(): FormControl {
    return this.registerForm.get('address') as FormControl;
  }
}
