import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManuscriptComponent } from './user-manuscript.component';

describe('UserManuscriptComponent', () => {
  let component: UserManuscriptComponent;
  let fixture: ComponentFixture<UserManuscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManuscriptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManuscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
