import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyRequestFullComponent } from './agency-request-full.component';

describe('AgencyRequestFullComponent', () => {
  let component: AgencyRequestFullComponent;
  let fixture: ComponentFixture<AgencyRequestFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyRequestFullComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyRequestFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
