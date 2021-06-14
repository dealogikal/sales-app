import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  OFFERS_STORAGE = 'demo_offers_storage';

  offers$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor() { }
}
