import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { TaxRateType } from '../helpers/classes/classes';
import { ObjectKeys } from '../helpers/pipes/pipe';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  items$: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private order: OrderService
  ) { }

  get(): Observable<any> {
    return this.items$.asObservable();
  }

  add(offer: any): Observable<any> {
    return this.items$.pipe(
      take(1),
      map(items => {
        const offerIndex = items.findIndex((item: any) => item.product_id == offer.product_id);
        if (offerIndex !== -1) {
          items[offerIndex] = offer;
        } else {
          items.push(offer);
        }
        return items;
      }),
      tap(items => {
        this.items$.next(items);
      })
    );
  }

  remove(offer: any): Observable<any> {
    return this.items$.pipe(
      take(1),
      map(items => {
        return items.filter((item: any) => item.id !== offer.id);
      }),
      tap(items => {
        this.items$.next(items);
      })
    );
  }

  clear(): void {
    this.items$.next([]);
  }

  total(): Observable<any> {
    return combineLatest(
      this.order.get(),
      this.get()
    ).pipe(map(([order, items]) => {
      const total = items.reduce((total: any, item: any) => {
        const tax_multiplier = (order.transaction.taxType == TaxRateType.VAT_REGISTERED) ? 0.12 : 0;
        const subtotal = item.currentPrice.perUnitTotal;
        const delivery = item.currentPrice.freightUnitTotal;
        const processing_fee = (order.transaction.processingRate / 100) * (subtotal + delivery);
        const value_added_tax = (subtotal + delivery + processing_fee) * tax_multiplier;

        const totalAmountDue = ((subtotal + processing_fee + delivery + (value_added_tax)));
        total += totalAmountDue
        return total;
      }, 0);

      return total;
    }))
  }

  breakdown(): Observable<any> {
    return combineLatest(
      this.order.get(),
      this.get()
    ).pipe(map(([order, items]) => {
      const breakdown = items.reduce((breakdown: any, item: any) => {
        const tax_multiplier = (order.transaction.taxType == TaxRateType.VAT_REGISTERED) ? 0.12 : 0;
        const subtotal = item.currentPrice.perUnitTotal;
        const delivery = item.currentPrice.freightUnitTotal;
        const processing_fee = (order.transaction.processingRate / 100) * (subtotal + delivery);
        const value_added_tax = (subtotal + delivery + processing_fee) * tax_multiplier;
        breakdown.subtotal += subtotal;
        breakdown.delivery += delivery;
        breakdown.processing_fee += processing_fee;
        breakdown.value_added_tax += value_added_tax;
        return breakdown;
      }, {
        subtotal: 0,
        delivery: 0,
        processing_fee: 0,
        value_added_tax: 0,
      });

      let result: any = [];
      result.push({
        key: 'subtotal',
        label: 'subtotal',
        value: breakdown.subtotal
      });
      result.push({
        key: 'delivery',
        label: 'delivery',
        value: breakdown.delivery
      });
      result.push({
        key: 'processing_fee',
        label: 'processing ee',
        value: breakdown.processing_fee
      });
      result.push({
        key: 'value_added_tax',
        label: 'value added tax',
        value: breakdown.value_added_tax
      });

      console.log('breakdown', result);

      return result;
    }))
  }
}
