import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAgencyDetailsComponent } from './simple-agency-details.component';

describe('SimpleAgencyDetailsComponent', () => {
  let component: SimpleAgencyDetailsComponent;
  let fixture: ComponentFixture<SimpleAgencyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleAgencyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleAgencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
