import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptProductionComponent } from './manuscript-production.component';

describe('ManuscriptProductionComponent', () => {
  let component: ManuscriptProductionComponent;
  let fixture: ComponentFixture<ManuscriptProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManuscriptProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
