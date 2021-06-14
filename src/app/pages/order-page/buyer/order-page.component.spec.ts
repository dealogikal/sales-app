import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOrderPageComponent } from './order-page.component';

describe('BuyerOrderPageComponent', () => {
  let component: BuyerOrderPageComponent;
  let fixture: ComponentFixture<BuyerOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerOrderPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
