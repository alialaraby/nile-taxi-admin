import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelRequestComponent } from './fuel-request.component';

describe('FuelRequestComponent', () => {
  let component: FuelRequestComponent;
  let fixture: ComponentFixture<FuelRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
