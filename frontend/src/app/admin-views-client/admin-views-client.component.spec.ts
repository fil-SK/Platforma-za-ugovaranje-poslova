import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewsClientComponent } from './admin-views-client.component';

describe('AdminViewsClientComponent', () => {
  let component: AdminViewsClientComponent;
  let fixture: ComponentFixture<AdminViewsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewsClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
