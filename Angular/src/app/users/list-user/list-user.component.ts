import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
  constructor(private api: AuthService) {}

  displayedColumns: string[] = ['id', 'email', 'name', 'address', 'action'];
  dataSource = null;

  ngOnInit(): void {
    this.allUsers();
  }
  allUsers() {
    this.api.getAllUsers().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  deleteUser(id: string) {
    this.api.deleteUser(id).subscribe({
      next: (res) => {
        alert('Delete user successfully');
        this.allUsers();
      },
      error: () => {
        alert('Delete user error');
      },
    });
  }
}
