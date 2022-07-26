import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateTripComponent } from './private-trip.component';

describe('PrivateTripComponent', () => {
  let component: PrivateTripComponent;
  let fixture: ComponentFixture<PrivateTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
