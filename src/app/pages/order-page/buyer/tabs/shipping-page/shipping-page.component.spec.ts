import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerShippingPageComponent } from './shipping-page.component';

describe('BuyerShippingPageComponent', () => {
  let component: BuyerShippingPageComponent;
  let fixture: ComponentFixture<BuyerShippingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerShippingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerShippingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
