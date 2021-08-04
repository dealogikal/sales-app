import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerShippingPageComponent } from './shipping-page.component';

describe('SellerShippingPageComponent', () => {
  let component: SellerShippingPageComponent;
  let fixture: ComponentFixture<SellerShippingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerShippingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerShippingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
