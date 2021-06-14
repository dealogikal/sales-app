import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  get(): Observable<any> {
    return this.order$.asObservable();
  }
  set(order: any): void {
    this.order$.next(order);
  }
  
  constructor() { }
}
