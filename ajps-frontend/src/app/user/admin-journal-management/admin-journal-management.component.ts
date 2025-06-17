import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-journal-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-journal-management.component.html',
  styleUrl: './admin-journal-management.component.css'
})
export class AdminJournalManagementComponent {

  showForm = false;
  isEditMode = false;
  editIndex: number | null = null;

  journal = {
    journalName: '',
    issn: '',
    frequency: '',
    journalType: '',
    publisher: '',
    editor: '',
    contactEmail: '',
    journalUrl: '',
    aimsScopes: ''
  };

  journals: any[] = [
    {
      journalName: 'Sample Journal',
      issn: '1234-5678',
      frequency: 'Quarterly',
      journalType: 'Open Access',
      publisher: 'Sample Publisher',
      editor: 'Dr. John Doe',
      contactEmail: 'editor@samplejournal.com',
      journalUrl: 'https://samplejournal.com',
      aimsScopes: 'To advance research in sample fields.'
    }
  ];

  showAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.editIndex = null;
    this.resetForm();
  }

  editJournal(index: number) {
    this.showForm = true;
    this.isEditMode = true;
    this.editIndex = index;
    this.journal = { ...this.journals[index] };
  }

  deleteJournal(index: number) {
    if (confirm('Are you sure you want to delete this journal?')) {
      this.journals.splice(index, 1);
      alert('Journal deleted successfully!');
    }
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isEditMode && this.editIndex !== null) {
        this.journals[this.editIndex] = { ...this.journal };
        alert('Journal updated successfully!');
      } else {
        this.journals.push({ ...this.journal });
        alert('Journal created successfully!');
      }
      this.showForm = false;
      this.resetForm();
      form.resetForm();
    }
  }

  private resetForm() {
    this.journal = {
      journalName: '',
      issn: '',
      frequency: '',
      journalType: '',
      publisher: '',
      editor: '',
      contactEmail: '',
      journalUrl: '',
      aimsScopes: ''
    };
  }

}
