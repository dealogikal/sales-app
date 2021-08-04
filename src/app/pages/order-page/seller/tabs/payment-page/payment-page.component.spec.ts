import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerPaymentPageComponent } from './payment-page.component';

describe('SellerPaymentPageComponent', () => {
  let component: SellerPaymentPageComponent;
  let fixture: ComponentFixture<SellerPaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerPaymentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
