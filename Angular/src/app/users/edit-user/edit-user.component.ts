import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  editUserForm = new FormGroup({
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
  });

  registerSubmit() {}
  get Email(): FormControl {
    return this.editUserForm.get('email') as FormControl;
  }

  get Name(): FormControl {
    return this.editUserForm.get('name') as FormControl;
  }

  get Phone(): FormControl {
    return this.editUserForm.get('phone') as FormControl;
  }

  get Password(): FormControl {
    return this.editUserForm.get('password') as FormControl;
  }
}
