import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBreakdownPageComponent } from './breakdown-page.component';

describe('BuyerBreakdownPageComponent', () => {
  let component: BuyerBreakdownPageComponent;
  let fixture: ComponentFixture<BuyerBreakdownPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerBreakdownPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBreakdownPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
