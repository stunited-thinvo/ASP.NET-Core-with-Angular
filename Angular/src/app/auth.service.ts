import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  baseServiceUrl = 'https://localhost:7009/api/';

  registerUser(email: string, phone: string, name: string, password: string) {
    return this.http.post(
      this.baseServiceUrl + 'Authentication/Register',
      {
        email: email,
        phone: phone,
        name: name,
        password: password,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  loginUser(email: string, pwd: string) {
    return this.http.post(
      this.baseServiceUrl + 'Authentication/Login',
      {
        email: email,
        password: pwd,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getAllUsers() {
    return this.http.get(this.baseServiceUrl + 'Employees');
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseServiceUrl + 'Employees/' + id, {
      responseType: 'text',
    });
  }

  addUser(email: string, phone: string, name: string, password: string, address: string) {
    return this.http.post(this.baseServiceUrl + 'Employees', {
      email: email,
      phone: phone,
      name: name,
      password: password,
      address: address,
    });
  }

  showUser(id:string){
    return this.http.get(this.baseServiceUrl + 'Employees/' + id);
  }

  editUser(id: string, email: string, phone: string, name: string,  address: string){
    return this.http.put(this.baseServiceUrl + 'Employees/'+ id, {
      email: email,
      phone: phone,
      name: name,
      id: id,
      address: address,
    },{
      responseType: 'text',
    });
  }
}
