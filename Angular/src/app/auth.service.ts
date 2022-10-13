import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  baseServiceUrl = 'https://localhost:4400';

  registerUser(user: Array<string>) {
    return this.http.post(
      this.baseServiceUrl + 'user/create',
      {
        email: user[0],
        name: user[1],
        phone: user[2],
        password: user[3],
      },
      {
        responseType: 'text',
      }
    );
  }

  loginUser(loginInfo: Array<string>) {
    return this.http.post(
      this.baseServiceUrl + 'LoginUser',
      {
        Email: loginInfo[0],
        Pwd: loginInfo[1],
      },
      {
        responseType: 'text',
      }
    );
  }
}
