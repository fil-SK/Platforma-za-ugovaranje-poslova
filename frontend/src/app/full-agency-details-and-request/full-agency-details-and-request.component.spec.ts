import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAgencyDetailsAndRequestComponent } from './full-agency-details-and-request.component';

describe('FullAgencyDetailsAndRequestComponent', () => {
  let component: FullAgencyDetailsAndRequestComponent;
  let fixture: ComponentFixture<FullAgencyDetailsAndRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullAgencyDetailsAndRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullAgencyDetailsAndRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
