import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleBusinessDetailsComponent } from './simple-business-details.component';

describe('SimpleBusinessDetailsComponent', () => {
  let component: SimpleBusinessDetailsComponent;
  let fixture: ComponentFixture<SimpleBusinessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleBusinessDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleBusinessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
