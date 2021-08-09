import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOfferFilterComponent } from './form-offer-filter.component';

describe('FormOfferFilterComponent', () => {
  let component: FormOfferFilterComponent;
  let fixture: ComponentFixture<FormOfferFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOfferFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOfferFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
