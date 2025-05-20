import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

declare const bootstrap: any;

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {








  showToast(title: string, message: string, type: string) {
    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toastHtml = `
      <div id="${toastId}" class="toast bg-${type} text-white" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">${title}</strong>
          <small>Just now</small>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;

    // Append toast to container
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
      toastContainer.insertAdjacentHTML('beforeend', toastHtml);

      // Initialize and show toast
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement, {
          autohide: true,
          delay: 5000 // Auto-dismiss after 5 seconds
        });
        toast.show();

        // Remove toast from DOM after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
          toastElement.remove();
        });
      }
    }
  }






}
