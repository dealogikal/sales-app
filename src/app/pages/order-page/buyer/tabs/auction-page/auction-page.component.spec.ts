import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAuctionPageComponent } from './auction-page.component';

describe('BuyerAuctionPageComponent', () => {
  let component: BuyerAuctionPageComponent;
  let fixture: ComponentFixture<BuyerAuctionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerAuctionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerAuctionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
