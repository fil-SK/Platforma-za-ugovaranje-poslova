import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullRequestPageComponent } from './full-request-page.component';

describe('FullRequestPageComponent', () => {
  let component: FullRequestPageComponent;
  let fixture: ComponentFixture<FullRequestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullRequestPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
