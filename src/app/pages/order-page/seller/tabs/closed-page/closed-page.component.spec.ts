import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerClosedPageComponent } from './closed-page.component';

describe('SellerClosedPageComponent', () => {
  let component: SellerClosedPageComponent;
  let fixture: ComponentFixture<SellerClosedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerClosedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerClosedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
