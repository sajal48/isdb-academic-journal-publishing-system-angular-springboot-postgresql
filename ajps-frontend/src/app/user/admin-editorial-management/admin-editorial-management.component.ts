import { Component } from '@angular/core';
import { BootstrapModalService } from '../../site-settings/services/bootstrap-modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Editor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  assignedJournals: { journalId: number; designation: string }[];
  status: string;
}

interface Journal {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin-editorial-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-editorial-management.component.html',
  styleUrl: './admin-editorial-management.component.css'
})
export class AdminEditorialManagementComponent {

  selectedJournalId: string = '';
  selectedJournal: Journal | null = null;
  selectedEditor: Editor | null = null;
  selectedDesignation: string = '';
  journals: Journal[] = [
    { id: 1, name: 'Journal of Science' },
    { id: 2, name: 'Journal of Technology' },
  ];
  editors: Editor[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      assignedJournals: [{ journalId: 1, designation: 'Editor-in-Chief' }],
      status: 'Active',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      assignedJournals: [{ journalId: 1, designation: 'Associate Editor' }],
      status: 'Active',
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Brown',
      email: '',
      assignedJournals: [],
      status: 'Active',
    },
    {
      id: 4,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      assignedJournals: [],
      status: 'Active',
    },
  ];

  constructor(private modalService: BootstrapModalService) {}

  loadJournalPanel() {
    this.selectedJournal = this.journals.find((journal) => journal.id === +this.selectedJournalId) || null;
  }

  getEditorsByDesignation(designation: string): Editor[] {
    if (!this.selectedJournal) return [];
    return this.editors.filter((editor) =>
      editor.assignedJournals.some(
        (assignment) => assignment.journalId === this.selectedJournal!.id && assignment.designation === designation
      )
    );
  }

  getEditorDesignation(editor: Editor): string {
    if (!this.selectedJournal) return '';
    const assignment = editor.assignedJournals.find(a => a.journalId === this.selectedJournal!.id);
    return assignment?.designation || '';
  }

  get availableEditors(): Editor[] {
    if (!this.selectedJournal) return [];
    return this.editors.filter(
      (editor) => !editor.assignedJournals.some((assignment) => assignment.journalId === this.selectedJournal!.id)
    );
  }

  isEditorAssigned(editor: Editor): boolean {
    return this.selectedJournal
      ? editor.assignedJournals.some((assignment) => assignment.journalId === this.selectedJournal!.id)
      : false;
  }

  openAssignModal(designation: string) {
    this.selectedEditor = null;
    this.selectedDesignation = designation;
    this.modalService.show('assignEditorModal');
  }

  assignEditorToJournal() {
    if (this.selectedEditor && this.selectedJournal && this.selectedDesignation) {
      this.editors = this.editors.map((editor) =>
        editor.id === this.selectedEditor!.id
          ? {
              ...editor,
              assignedJournals: [
                ...editor.assignedJournals,
                { journalId: this.selectedJournal!.id, designation: this.selectedDesignation },
              ],
            }
          : editor
      );
      this.selectedEditor = null;
      this.selectedDesignation = '';
    }
  }

  removeEditorFromJournal(editor: Editor) {
    if (this.selectedJournal) {
      this.editors = this.editors.map((e) =>
        e.id === editor.id
          ? {
              ...e,
              assignedJournals: e.assignedJournals.filter(
                (assignment) => assignment.journalId !== this.selectedJournal!.id
              ),
            }
          : e
      );
    }
  }

}
