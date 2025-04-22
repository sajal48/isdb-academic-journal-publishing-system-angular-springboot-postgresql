import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsViewComponent } from './editors-view.component';

describe('EditorsViewComponent', () => {
  let component: EditorsViewComponent;
  let fixture: ComponentFixture<EditorsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
