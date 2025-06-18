import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptPublicationComponent } from './manuscript-publication.component';

describe('ManuscriptPublicationComponent', () => {
  let component: ManuscriptPublicationComponent;
  let fixture: ComponentFixture<ManuscriptPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManuscriptPublicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
