import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceMatrixComponent } from './price-matrix.component';

describe('PriceMatrixComponent', () => {
  let component: PriceMatrixComponent;
  let fixture: ComponentFixture<PriceMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
