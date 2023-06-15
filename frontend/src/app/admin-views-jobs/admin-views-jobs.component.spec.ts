import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewsJobsComponent } from './admin-views-jobs.component';

describe('AdminViewsJobsComponent', () => {
  let component: AdminViewsJobsComponent;
  let fixture: ComponentFixture<AdminViewsJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewsJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewsJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
