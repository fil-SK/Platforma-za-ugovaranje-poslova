import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoingRegistrationComponent } from './admin-doing-registration.component';

describe('AdminDoingRegistrationComponent', () => {
  let component: AdminDoingRegistrationComponent;
  let fixture: ComponentFixture<AdminDoingRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDoingRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoingRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
