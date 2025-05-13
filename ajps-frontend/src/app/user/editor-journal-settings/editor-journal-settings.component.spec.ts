import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorJournalSettingsComponent } from './editor-journal-settings.component';

describe('EditorJournalSettingsComponent', () => {
  let component: EditorJournalSettingsComponent;
  let fixture: ComponentFixture<EditorJournalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorJournalSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorJournalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
