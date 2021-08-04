import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { OrderStatus, PaymentMethods, TaxRateType } from '../helpers/classes/classes';
import { OrderService } from './order.service';
import { OrdersService } from './orders.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private order: OrderService,
    private user: UserService,
    private orders: OrdersService
  ) { }

  

  total(): Observable<any> {
    return this.order.get().pipe(map((order) => {
      const total = order.orders.products.reduce((total: any, item: any) => {
        const tax_multiplier = (order.transaction.taxType == TaxRateType.VAT_REGISTERED) ? 0.12 : 0;
        const subtotal = item.selectedPrice.currentPrice.perUnitTotal;
        const delivery = item.selectedPrice.currentPrice.freightUnitTotal;
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
    return this.order.get().pipe(
      map(order => {
        const breakdown = order.orders.products.reduce((breakdown: any, item: any) => {
          const tax_multiplier = (order.transaction.taxType == TaxRateType.VAT_REGISTERED) ? 0.12 : 0;
          const subtotal = item.selectedPrice.currentPrice.perUnitTotal;
          const delivery = item.selectedPrice.currentPrice.freightUnitTotal;
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

        // console.log('breakdown', result);
        return result;
      })
    );
  }
}
