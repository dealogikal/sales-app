import { TestBed } from '@angular/core/testing';

import { BuyerCronService } from './buyer-cron.service';

describe('BuyerCronService', () => {
  let service: BuyerCronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyerCronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
