import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalOperationsService } from '../../site-settings/admin/journal-operations.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';
import { EditorOperationsService } from '../../site-settings/admin/editor-operations.service';

declare const bootstrap: any;

interface JournalShort {
  id: number;
  title: string;
}

interface Editor {
  authId: number;
  profileId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  assignedJournals: JournalShort[];
}

@Component({
  selector: 'app-admin-editor-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-editor-management.component.html',
  styleUrls: ['./admin-editor-management.component.css']
})
export class AdminEditorManagementComponent implements OnInit {
  editorSearchQuery: string = '';
  journalFilter: string = '';
  journals: JournalShort[] = [];

  editors: Editor[] = [];
  filteredEditors: Editor[] = [];

  selectedEditor: Editor | null = null;
  journalSelections: { [journalId: number]: boolean } = {};

  constructor(
    private journalService: JournalOperationsService,
    private editorService: EditorOperationsService,
    private userToastNotificationService: UserToastNotificationService
  ) {}

  ngOnInit() {
    this.loadJournals();
    this.loadEditors();
  }

  loadJournals() {
    this.journalService.getAll().subscribe((data: any[]) => {
      this.journals = data.map(j => ({ id: j.id, title: j.journalName }));
    });
  }

  loadEditors() {
    this.editorService.getAllEditors().subscribe((data: any[]) => {
      this.editors = data.map((item: any) => ({
        authId: item.authId,
        profileId: item.profileId,
        firstName: item.firstName,
        middleName: item.middleName,
        lastName: item.lastName,
        email: item.email,
        assignedJournals: item.assignedJournals || []
      }));
      this.filteredEditors = [...this.editors];
    });
  }

  searchEditors() {
    const query = this.editorSearchQuery.toLowerCase();
    this.filteredEditors = this.editors.filter(editor => {
      const matchesQuery =
        editor.firstName?.toLowerCase().includes(query) ||
        editor.lastName?.toLowerCase().includes(query) ||
        editor.email?.toLowerCase().includes(query);

      const matchesJournal =
        !this.journalFilter ||
        (this.journalFilter === '__UNASSIGNED__'
          ? editor.assignedJournals.length === 0
          : editor.assignedJournals.some(j => j.title === this.journalFilter));

      return matchesQuery && matchesJournal;
    });
  }

  clearEditorSearch() {
    this.editorSearchQuery = '';
    this.journalFilter = '';
    this.filteredEditors = [...this.editors];
  }

  openEditAssignedJournals(editor: Editor) {
    this.selectedEditor = editor;
    this.journalSelections = {};
    this.journals.forEach(journal => {
      this.journalSelections[journal.id] = editor.assignedJournals.some(j => j.id === journal.id);
    });

    const modal = new bootstrap.Modal(document.getElementById('editAssignedJournalsModal')!);
    modal.show();
  }

  saveAssignedJournals() {
    if (!this.selectedEditor) return;

    const selectedIds = Object.keys(this.journalSelections)
      .filter(id => this.journalSelections[+id])
      .map(id => +id);
    debugger
    this.editorService.assignJournalsToEditor(this.selectedEditor.profileId, selectedIds).subscribe({
      next: () => {
        this.userToastNotificationService.showToast('Success', 'Journals assigned successfully', 'success');
        this.loadEditors();
      },
      error: () => {
        this.userToastNotificationService.showToast('Error', 'Failed to assign journals', 'danger');
      }
    });

    this.selectedEditor = null;
    this.journalSelections = {};
  }

  getJournalTitles(editor: Editor): string {
    return editor.assignedJournals && editor.assignedJournals.length
      ? editor.assignedJournals.map(j => j.title).join(', ')
      : '--';
  }
}
