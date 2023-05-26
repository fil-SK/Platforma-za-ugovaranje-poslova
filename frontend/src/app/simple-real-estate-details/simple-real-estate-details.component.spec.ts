import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleRealEstateDetailsComponent } from './simple-real-estate-details.component';

describe('SimpleRealEstateDetailsComponent', () => {
  let component: SimpleRealEstateDetailsComponent;
  let fixture: ComponentFixture<SimpleRealEstateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleRealEstateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleRealEstateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
