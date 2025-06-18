import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptCopyeditingComponent } from './manuscript-copyediting.component';

describe('ManuscriptCopyeditingComponent', () => {
  let component: ManuscriptCopyeditingComponent;
  let fixture: ComponentFixture<ManuscriptCopyeditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManuscriptCopyeditingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptCopyeditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
