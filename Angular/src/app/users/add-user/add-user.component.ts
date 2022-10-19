import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  loginForm: FormGroup;
  constructor(  private router: Router, private api: AuthService) { }

  ngOnInit(): void {

  }
  addUserForm = new FormGroup({
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
    address: new FormControl('')
  });


  formSubmit(){
    const { email, phone, name, password, address } = this.addUserForm.value;
    this.api.addUser(email, phone, name, password, address).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/users');
        alert('Success');
      },
      error: (err) => {
        alert(err.errors);
      },
    });
  }

  get Email(): FormControl {
    return this.addUserForm.get('email') as FormControl;
  }

  get Name(): FormControl {
    return this.addUserForm.get('name') as FormControl;
  }

  get Phone(): FormControl {
    return this.addUserForm.get('phone') as FormControl;
  }

  get Password(): FormControl {
    return this.addUserForm.get('password') as FormControl;
  }

  get Address(): FormControl {
    return this.addUserForm.get('address') as FormControl;
  }

}
