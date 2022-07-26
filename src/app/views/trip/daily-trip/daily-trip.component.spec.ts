import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTripComponent } from './daily-trip.component';

describe('DailyTripComponent', () => {
  let component: DailyTripComponent;
  let fixture: ComponentFixture<DailyTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
