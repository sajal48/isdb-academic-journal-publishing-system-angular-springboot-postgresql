import { Injectable } from '@angular/core';

interface ModalElements {
  overlay: HTMLElement | null;
  container: HTMLElement | null;
  title: HTMLElement | null;
  message: HTMLElement | null;
  confirmButton: HTMLButtonElement | null;
  cancelButton: HTMLButtonElement | null;
}

@Injectable({
  providedIn: 'root'
})
export class PopupMessageService {

  private elements: ModalElements;
  private resolvePromise: ((value: boolean) => void) | null = null;

  constructor() {
    this.createModalElements();
    this.elements = {
      overlay: document.getElementById('custom-modal-overlay'),
      container: document.getElementById('custom-modal-container'),
      title: document.getElementById('modal-title'),
      message: document.getElementById('modal-message'),
      confirmButton: document.getElementById('modal-confirm-button') as HTMLButtonElement,
      cancelButton: document.getElementById('modal-cancel-button') as HTMLButtonElement,
    };

    this.attachEventListeners();
  }

  // Creates and appends the modal HTML to the body if it doesn't exist
  private createModalElements(): void {
    if (!document.getElementById('custom-modal-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'custom-modal-overlay';
      overlay.className = 'modal-overlay hidden'; // Start hidden

      const container = document.createElement('div');
      container.id = 'custom-modal-container';
      container.className = 'modal-container hidden'; // Start hidden

      container.innerHTML = `
        <div class="modal-header">
          <h3 id="modal-title"></h3>
          <button class="modal-close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p id="modal-message"></p>
        </div>
        <div class="modal-footer">
          <button id="modal-confirm-button" class="modal-button"></button>
          <button id="modal-cancel-button" class="modal-button"></button>
        </div>
      `;

      overlay.appendChild(container);
      document.body.appendChild(overlay);
    }
  }

  private attachEventListeners(): void {
    this.elements.confirmButton?.addEventListener('click', () => this.handleConfirm(true));
    this.elements.cancelButton?.addEventListener('click', () => this.handleConfirm(false));
    this.elements.overlay?.addEventListener('click', () => this.handleConfirm(false)); // Close on overlay click
    this.elements.container?.querySelector('.modal-close-button')?.addEventListener('click', () => this.handleConfirm(false));
  }

  private handleConfirm(confirmed: boolean): void {
    this.hideModal();
    if (this.resolvePromise) {
      this.resolvePromise(confirmed);
      this.resolvePromise = null; // Clear the promise resolver
    }
  }

  private showModal(): void {
    this.elements.overlay?.classList.remove('hidden');
    this.elements.container?.classList.remove('hidden');
    // For smoother transition, remove hidden class then trigger reflow
    // void this.elements.overlay?.offsetWidth; // Triggers reflow
  }

  public hideModal(): void {
    this.elements.overlay?.classList.add('hidden');
    this.elements.container?.classList.add('hidden');
  }

  // --- Public Methods for Alert and Confirmation ---

  public alert(title: string, message: string): Promise<void> {
    return new Promise(resolve => {
      if (!this.elements.title || !this.elements.message || !this.elements.confirmButton || !this.elements.cancelButton) {
        console.error('Modal elements not found.');
        resolve();
        return;
      }

      this.elements.title.textContent = title;
      this.elements.message.textContent = message;
      this.elements.confirmButton.textContent = 'OK';
      this.elements.confirmButton.className = 'modal-button primary-button'; // Reset class
      this.elements.cancelButton.classList.add('hidden'); // Hide cancel button for alert

      this.resolvePromise = (confirmed: boolean) => resolve(); // Resolve when OK is clicked
      this.showModal();
    });
  }

  public confirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.elements.title || !this.elements.message || !this.elements.confirmButton || !this.elements.cancelButton) {
        console.error('Modal elements not found.');
        resolve(false);
        return;
      }

      this.elements.title.textContent = title;
      this.elements.message.textContent = message;
      this.elements.confirmButton.textContent = confirmText;
      this.elements.confirmButton.className = 'modal-button danger-button'; // Style for confirmation
      this.elements.cancelButton.textContent = cancelText;
      this.elements.cancelButton.className = 'modal-button secondary-button'; // Style for cancel
      this.elements.cancelButton.classList.remove('hidden'); // Show cancel button

      this.resolvePromise = resolve; // This will resolve with true/false based on user click
      this.showModal();
    });
  }

}
