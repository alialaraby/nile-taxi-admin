import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkInUserComponent } from './walk-in-user.component';

describe('WalkInUserComponent', () => {
  let component: WalkInUserComponent;
  let fixture: ComponentFixture<WalkInUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkInUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
