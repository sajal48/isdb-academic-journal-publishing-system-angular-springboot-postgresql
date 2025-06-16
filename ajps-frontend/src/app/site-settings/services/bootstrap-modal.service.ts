import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BootstrapModalService {

  show(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
}
