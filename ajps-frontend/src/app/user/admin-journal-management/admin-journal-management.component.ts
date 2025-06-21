import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Journal, JournalOperationsService } from '../../site-settings/admin/journal-operations.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';
import { PopupMessageService } from '../../site-settings/toast-popup/popup-message.service'; // Import PopupMessageService

@Component({
  selector: 'app-admin-journal-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-journal-management.component.html',
  styleUrls: ['./admin-journal-management.component.css']
})
export class AdminJournalManagementComponent implements OnInit {

  showForm = false;
  isEditMode = false;
  editIndex: number | null = null;

  journals: Journal[] = [];

  journal: Journal = this.getEmptyJournal();

  constructor(
    private journalService: JournalOperationsService,
    private userToastNotificationService: UserToastNotificationService,
    private popupMessageService: PopupMessageService // Inject PopupMessageService
  ) {}

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getAll().subscribe({
      next: (data) => this.journals = data,
      error: (err) => {
        console.error('Failed to load journals:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load journals.', 'danger');
      }
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.editIndex = null;
    this.journal = this.getEmptyJournal();
  }

  editJournal(index: number): void {
    this.showForm = true;
    this.isEditMode = true;
    this.editIndex = index;
    this.journal = { ...this.journals[index] };
  }

  deleteJournal(index: number): void {
    const journal = this.journals[index];
    if (journal.id) {
      this.popupMessageService.confirm(
        'Delete Journal?',
        `Are you sure you want to delete the journal "${journal.journalName}" permanently?`,
        'Yes, Delete',
        'Cancel'
      ).then((confirmed) => {
        if (confirmed) {
          this.journalService.delete(journal.id!).subscribe({ // Use non-null assertion as we've checked for journal.id
            next: () => {
              this.journals.splice(index, 1);
              this.userToastNotificationService.showToast('Success', 'Journal deleted successfully!', 'success');
            },
            error: (err) => {
              console.error('Failed to delete journal:', err);
              this.userToastNotificationService.showToast('Error', 'Failed to delete journal.', 'danger');
            }
          });
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.journal = this.getEmptyJournal();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.userToastNotificationService.showToast('Warning', 'Please fill in all required fields.', 'warning');
      return;
    }

    if (this.isEditMode && this.journal.id) {
      this.journalService.update(this.journal.id, this.journal).subscribe({
        next: (updated) => {
          if (this.editIndex !== null) {
            this.journals[this.editIndex] = updated;
          }
          this.userToastNotificationService.showToast('Success', 'Journal updated successfully!', 'success');
          this.showForm = false;
          form.resetForm();
        },
        error: (err) => {
          console.error('Failed to update journal:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to update journal.', 'danger');
        }
      });
    } else {
      this.journalService.create(this.journal).subscribe({
        next: (created) => {
          this.journals.push(created);
          this.userToastNotificationService.showToast('Success', 'Journal created successfully!', 'success');
          this.showForm = false;
          form.resetForm();
        },
        error: (err) => {
          console.error('Failed to create journal:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to create journal.', 'danger');
        }
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
      aboutJournal: ''
    };
  }
}