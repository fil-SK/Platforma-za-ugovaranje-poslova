import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullRealEstateDetailsComponent } from './full-real-estate-details.component';

describe('FullRealEstateDetailsComponent', () => {
  let component: FullRealEstateDetailsComponent;
  let fixture: ComponentFixture<FullRealEstateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullRealEstateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullRealEstateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
