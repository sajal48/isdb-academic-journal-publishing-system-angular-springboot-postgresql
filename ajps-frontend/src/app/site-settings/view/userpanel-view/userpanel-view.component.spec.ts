import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpanelViewComponent } from './userpanel-view.component';

describe('UserpanelViewComponent', () => {
  let component: UserpanelViewComponent;
  let fixture: ComponentFixture<UserpanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserpanelViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserpanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
