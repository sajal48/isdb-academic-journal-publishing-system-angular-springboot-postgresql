import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminOperationsService } from '../../site-settings/admin/admin-operations.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';

declare const bootstrap: any;

interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspend';
  sendEmail?: boolean;
}

@Component({
  selector: 'app-admin-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css'
})
export class AdminUserManagementComponent {

  constructor(
    private adminOperations: AdminOperationsService,
    private userToastNotificationService: UserToastNotificationService
  ) { }

  newUser: User = {
    id: 0,
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: '',
    status: 'Active',
    sendEmail: true
  };

  editUser: User = {
    id: 0,
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: '',
    status: 'Active',
    sendEmail: false
  };


  users: User[] = [];

  filteredUsers: User[] = [];
  searchQuery: string = '';

  loadUsersFromBackend() {
    this.adminOperations.getAllUsers().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.users = response.data; // or response.data.users if nested
          this.filteredUsers = [...this.users];
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to load users.', 'danger');
        }
      },
      error: () => {
        this.userToastNotificationService.showToast('Error', 'Server error while fetching users.', 'danger');
      }
    });
  }

  addUser() {
    const payload = {
      firstName: this.newUser.firstName,
      middleName: this.newUser.middleName,
      lastName: this.newUser.lastName,
      email: this.newUser.email,
      userRole: this.newUser.role.toUpperCase(), // backend expects uppercase enum
      status: this.newUser.status.toUpperCase(),
      sendEmail: this.newUser.sendEmail
    };

    this.adminOperations.createNewUser(payload).subscribe({
      next: (response) => {

        if (response.code === 200 || response.code === 201) {
          // console.log(response.message);
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');
          this.resetForm();

        } else {
          // console.log(response.message);
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }

      }
    });
  }

  openEditUserModal(user: User) {
    this.editUser = { ...user }; // clone user
    const modal = new bootstrap.Modal(document.getElementById('editUserModal')!);
    modal.show();
  }

  isUpdating: boolean = false;
  updateUser() {
    this.isUpdating = true;

    const payload = {
      firstName: this.editUser.firstName,
      middleName: this.editUser.middleName,
      lastName: this.editUser.lastName,
      email: this.editUser.email,
      userRole: this.editUser.role.toUpperCase(),
      status: this.editUser.status.toUpperCase(),
      sendEmail: this.editUser.sendEmail ?? false
    };

    this.adminOperations.updateUser(this.editUser.id, payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');
          this.loadUsersFromBackend(); // Reload updated list
          this.resetEditForm();
          bootstrap.Modal.getInstance(document.getElementById('editUserModal')!)?.hide();
        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
        this.isUpdating = false;
      },
      error: () => {
        this.userToastNotificationService.showToast('Error', 'Update failed.', 'danger');
        this.isUpdating = false;
      }
    });
  }



  resetForm() {
    this.newUser = {
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      role: '',
      status: 'Active',
      sendEmail: true
    };
  }

  resetEditForm() {
    this.editUser = {
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      role: '',
      status: 'Active',
      sendEmail: false
    };
  }


  searchUsers() {
    const query = this.searchQuery.toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      (user.firstName?.toLowerCase().includes(query) ?? false) ||
      (user.lastName?.toLowerCase().includes(query) ?? false) ||
      (user.email?.toLowerCase().includes(query) ?? false) ||
      (user.role?.toLowerCase().includes(query) ?? false)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredUsers = [...this.users];
  }



}
