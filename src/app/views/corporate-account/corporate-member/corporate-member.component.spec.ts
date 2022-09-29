import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateMemberComponent } from './corporate-member.component';

describe('CorporateMemberComponent', () => {
  let component: CorporateMemberComponent;
  let fixture: ComponentFixture<CorporateMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
