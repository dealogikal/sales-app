import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAuctionPageComponent } from './auction-page.component';

describe('SellerAuctionPageComponent', () => {
  let component: SellerAuctionPageComponent;
  let fixture: ComponentFixture<SellerAuctionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerAuctionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerAuctionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
