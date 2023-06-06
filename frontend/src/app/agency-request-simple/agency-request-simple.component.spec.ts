import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyRequestSimpleComponent } from './agency-request-simple.component';

describe('AgencyRequestSimpleComponent', () => {
  let component: AgencyRequestSimpleComponent;
  let fixture: ComponentFixture<AgencyRequestSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyRequestSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyRequestSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
