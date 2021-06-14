import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDrawerComponent } from './checkout-drawer.component';

describe('CheckoutDrawerComponent', () => {
  let component: CheckoutDrawerComponent;
  let fixture: ComponentFixture<CheckoutDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
