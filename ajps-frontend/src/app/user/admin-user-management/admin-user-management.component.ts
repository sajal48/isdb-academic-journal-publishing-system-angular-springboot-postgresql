import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Deleted';
  sendEmail?: boolean;
}

@Component({
  selector: 'app-admin-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css'
})
export class AdminUserManagementComponent {

  newUser: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: 'Active',
    sendEmail: true
  };

  users: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' }
  ];

  filteredUsers: User[] = [...this.users];
  searchQuery: string = '';

  addUser() {
    if (this.newUser.firstName && this.newUser.lastName && this.newUser.email && this.newUser.role) {
      const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      const userToAdd: User = {
        ...this.newUser,
        id: newId,
        status: 'Active'
      };
      this.users = [...this.users, userToAdd];
      this.filteredUsers = [...this.users];

      if (userToAdd.sendEmail) {
        this.sendPasswordEmail(userToAdd);
      }

      this.newUser = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        status: 'Active',
        sendEmail: true
      };
    }
  }

  sendPasswordEmail(user: User) {
    console.log(`Sending email to ${user.email} with password for user ${user.firstName} ${user.lastName} (Role: ${user.role})`);
  }

  searchUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredUsers = [...this.users];
  }

  toggleSuspend(user: User) {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    );
    this.filteredUsers = [...this.users];
  }

  deleteUser(user: User) {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, status: 'Deleted' } : u
    );
    this.filteredUsers = [...this.users];
  }


}
