import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  baseServiceUrl = 'https://localhost:7009/api/';

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
      this.baseServiceUrl + 'Authentication/Login',
      {
        email: loginInfo[0],
        password: loginInfo[1],
      },
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    );
  }
}
