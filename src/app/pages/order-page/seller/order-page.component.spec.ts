import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrderPageComponent } from './order-page.component';

describe('SellerOrderPageComponent', () => {
  let component: SellerOrderPageComponent;
  let fixture: ComponentFixture<SellerOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerOrderPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
