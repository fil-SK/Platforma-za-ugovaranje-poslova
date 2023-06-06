import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewsAgencyComponent } from './admin-views-agency.component';

describe('AdminViewsAgencyComponent', () => {
  let component: AdminViewsAgencyComponent;
  let fixture: ComponentFixture<AdminViewsAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewsAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewsAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
