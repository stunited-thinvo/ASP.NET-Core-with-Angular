import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginAuth: AuthService) { }

  ngOnInit(): void {}

  isUserValid: boolean = false;

  loginForm =  new FormGroup({
    email:  new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
  });

  loginSubmited() {
    // this.loginAuth.loginUser([this.loginForm.value.email, this.loginForm.value.pwd]).subscribe(res => {
    //   if(res == 'Failure'){
    //     this.isUserValid = false
    //     alert('Login Unsuccessful');
    //   }
    //   else{
    //     this.isUserValid =true;
    //     alert('Login Success');
    //   }
    // });
    console.log([this.loginForm.value.email, this.loginForm.value.pwd]);
  }

  get Email():FormControl{
    return this.loginForm.get('email') as FormControl;
  }

  get PWD():FormControl{
    return this.loginForm.get('pwd') as FormControl;
  }
}
