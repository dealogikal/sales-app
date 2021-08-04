import { TestBed } from '@angular/core/testing';

import { SellerCronService } from './seller-cron.service';

describe('SellerCronService', () => {
  let service: SellerCronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerCronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
