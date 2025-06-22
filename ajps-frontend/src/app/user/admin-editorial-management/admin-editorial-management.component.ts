import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BootstrapModalService } from '../../site-settings/services/bootstrap-modal.service';
import { Editor, EditorialManagementService, Journal } from '../../site-settings/admin/editorial-management.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';

@Component({
  selector: 'app-admin-editorial-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-editorial-management.component.html',
  styleUrl: './admin-editorial-management.component.css'
})
export class AdminEditorialManagementComponent implements OnInit {

  journals: Journal[] = [];
  editors: Editor[] = [];

  selectedJournalId: string = '';
  selectedJournal: Journal | null = null;
  selectedEditor: Editor | null = null;
  selectedDesignation: string = '';

  editorDesignations: string[] = [
    'Editor-in-Chief',
    'Executive Editor',
    'Advisory Editor',
    'Editor',
    'Editorial Assistant'
  ];

  constructor(
    private modalService: BootstrapModalService,
    private editorialService: EditorialManagementService,
    private toastService: UserToastNotificationService

  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.editorialService.getJournals().subscribe(journals => this.journals = journals);
    this.editorialService.getEditors().subscribe(editors => this.editors = editors);
  }

  loadJournalPanel(): void {
    this.selectedJournal = this.journals.find(j => j.id === +this.selectedJournalId) || null;
  }

  sanitizeDesignation(designation: string): string {
    return designation.replace(/\s+/g, '');
  }

  getEditorsByDesignation(designation: string): Editor[] {
    if (!this.selectedJournal) return [];
    return this.editors.filter(editor =>
      editor.assignedJournals.some(a => a.journalId === this.selectedJournal!.id && a.designation === designation)
    );
  }

  getEditorDesignation(editor: Editor): string {
    if (!this.selectedJournal) return '';
    const assignment = editor.assignedJournals.find(a => a.journalId === this.selectedJournal!.id);
    return assignment?.designation || '';
  }

  get availableEditors(): Editor[] {
    if (!this.selectedJournal) return [];
    return this.editors.filter(editor =>
      !editor.assignedJournals.some(a => a.journalId === this.selectedJournal!.id)
    );
  }

  isEditorAssigned(editor: Editor): boolean {
    return this.selectedJournal
      ? editor.assignedJournals.some(a => a.journalId === this.selectedJournal!.id)
      : false;
  }

  openAssignModal(designation: string): void {
    this.selectedEditor = null;
    this.selectedDesignation = designation;
    this.modalService.show('assignEditorModal');
  }

  assignEditorToJournal(): void {
    if (this.selectedEditor && this.selectedJournal && this.selectedDesignation) {
      this.editorialService
        .assignEditor(this.selectedEditor.profileId, this.selectedJournal.id, this.selectedDesignation)
        .subscribe({
          next: () => {
            this.toastService.showToast('Success', 'Editor assigned successfully!', 'success');
            this.loadData();
          },
          error: (err) => {
            this.toastService.showToast('Error', 'Failed to assign editor.', 'danger');
            console.error(err);
          },
        });

      this.selectedEditor = null;
      this.selectedDesignation = '';
    }
  }


  removeEditorFromJournal(editor: Editor): void {
    if (this.selectedJournal) {
      this.editorialService
        .removeEditor(editor.profileId, this.selectedJournal.id)
        .subscribe({
          next: () => {
            this.toastService.showToast('Success', 'Editor removed successfully!', 'success');
            this.loadData();
          },
          error: (err) => {
            this.toastService.showToast('Error', 'Failed to remove editor.', 'danger');
            console.error(err);
          },
        });
    }
  }

}
