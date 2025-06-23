import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Journal, JournalOperationsService } from '../../site-settings/admin/journal-operations.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';
import { PopupMessageService } from '../../site-settings/toast-popup/popup-message.service';
import { CommonModule } from '@angular/common';
import { FilePreviewPipe } from '../../site-settings/pipe/file-preview.pipe';

@Component({
  selector: 'app-admin-journal-management',
  templateUrl: './admin-journal-management.component.html',
  styleUrls: ['./admin-journal-management.component.css'],
  imports: [CommonModule, FormsModule, FilePreviewPipe]
})
export class AdminJournalManagementComponent implements OnInit {
  journals: Journal[] = [];
  showForm = false;
  isEditMode = false;
  editIndex: number | null = null;
  journal: Journal = this.getEmptyJournal();
  coverImageFile: File | null = null;
  public readonly BASE_URL = 'localhost:4500/journal/';

  constructor(
    private journalService: JournalOperationsService,
    private toast: UserToastNotificationService,
    private popup: PopupMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getAll().subscribe({
      next: (res) => {
        this.journals = res;
        this.cdr.detectChanges();
      },
      error: () => this.toast.showToast('Error', 'Failed to load journals', 'danger')
    });
  }

  showAddForm(): void {
    this.journal = this.getEmptyJournal();
    this.coverImageFile = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  editJournal(index: number): void {
    const selected = this.journals[index];
    this.journal = { ...selected };
    this.coverImageFile = null;
    this.isEditMode = true;
    this.editIndex = index;
    this.showForm = true;
  }

  deleteJournal(index: number): void {
    const journal = this.journals[index];
    this.popup.confirm('Delete Journal?', `Delete "${journal.journalName}" permanently?`, 'Yes, Delete', 'Cancel')
      .then(confirm => {
        if (confirm && journal.id) {
          this.journalService.delete(journal.id).subscribe({
            next: () => {
              this.journals.splice(index, 1);
              this.toast.showToast('Deleted', 'Journal deleted', 'success');
              this.cdr.detectChanges();
            },
            error: () => this.toast.showToast('Error', 'Delete failed', 'danger')
          });
        }
      });
  }

  cancelForm(): void {
    this.showForm = false;
    this.journal = this.getEmptyJournal();
    this.coverImageFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.coverImageFile = file;
    } else {
      this.coverImageFile = null;
      this.toast.showToast('Warning', 'Only image files allowed', 'warning');
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || (!this.coverImageFile && !this.journal.coverImageUrl)) {
      this.toast.showToast('Warning', 'Fill all required fields including image', 'warning');
      return;
    }

    const formData = new FormData();
    const journalPayload = { ...this.journal };
    formData.append('journal', new Blob([JSON.stringify(journalPayload)], { type: 'application/json' }));
    if (this.coverImageFile) formData.append('coverImage', this.coverImageFile);

    if (this.isEditMode && this.journal.id) {
      this.journalService.update(this.journal.id, formData).subscribe({
        next: (res) => {
          if (this.editIndex !== null) this.journals[this.editIndex] = res;
          this.toast.showToast('Updated', 'Journal updated successfully.', 'success');
          this.cancelForm();
          form.resetForm();
        },
        error: () => this.toast.showToast('Error', 'Journal update failed.', 'danger')
      });
    } else {
      this.journalService.create(formData).subscribe({
        next: (res) => {
          this.journals.push(res);
          this.toast.showToast('Created', 'Journal created successfully.', 'success');
          this.cancelForm();
          form.resetForm();
        },
        error: () => this.toast.showToast('Error', 'Journal creation failed.', 'danger')
      });
    }
  }

  private getEmptyJournal(): Journal {
    return {
      journalName: '',
      issn: '',
      frequency: '',
      journalType: '',
      journalCode: '',
      contactEmail: '',
      journalUrl: '',
      aimsScopes: '',
      aboutJournal: '',
      coverImageUrl: ''
    };
  }
}