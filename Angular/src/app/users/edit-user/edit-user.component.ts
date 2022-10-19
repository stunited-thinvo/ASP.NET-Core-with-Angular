import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  id: string;
  editUserForm: FormGroup;
  constructor(private route: ActivatedRoute, private api: AuthService,  private router: Router) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')
    this.api.showUser(this.id).subscribe({
      next: (res)=>{
        this.editUserForm = new FormGroup({
          id: new FormControl(this.id),
          name: new FormControl(res['name'], [Validators.required] ),
          email: new FormControl(res['email'], [Validators.required, Validators.email]),
          phone : new FormControl('0'+res['phone'], [
            Validators.required,
            Validators.pattern('[- +()0-9]+'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ]),
          address: new FormControl(res['address']),
        })
      },
      error:(err)=>{
        alert('Show User Error');
      }
    });
  }




  editSubmit() {
    const {id, email, phone, name, address } = this.editUserForm.value;
    this.api.editUser(id, email, phone, name, address).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/users');
        alert('Success');
      },
      error: (err) => {
        alert('Error');
      },
    });
  }



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
