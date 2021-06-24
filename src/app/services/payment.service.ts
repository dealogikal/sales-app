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

  next(products: any): Observable<any> {
    return combineLatest(
      this.user.get(),
      this.order.get()
    ).pipe(
      take(1),
      map(([user, order]) => {
        console.log(user, order);
        const closed = [
          OrderStatus.CLOSED_DEAL,
        ];

        const shipping = [
          OrderStatus.FOR_DELIVERY,
          OrderStatus.IN_TRANSIT,
          OrderStatus.PRODUCT_DELIVERED,
        ];

        const payment = [
          OrderStatus.FOR_BUYER_PAYMENT,
          OrderStatus.BUYER_PAYMENT_VERIFICATION,
          OrderStatus.SELLER_PAYMENT,
        ];

        const cod_breakdown = [
          OrderStatus.FOR_REVIEW,
          OrderStatus.SELLER_PAYMENT,
        ];

        const cod_payment = [
          OrderStatus.FOR_BUYER_PAYMENT,
          OrderStatus.BUYER_PAYMENT_VERIFICATION,
        ];


        const terms_breakdown = [
          OrderStatus.FOR_REVIEW,
        ];

        const terms_payment = [
          OrderStatus.FOR_BUYER_PAYMENT,
          OrderStatus.BUYER_PAYMENT_VERIFICATION,
          OrderStatus.SELLER_PAYMENT,
          OrderStatus.SELLER_PAYMENT_VERIFICATION,
        ];

        const terms_shipping = [
          OrderStatus.FOR_DELIVERY,
          OrderStatus.IN_TRANSIT,
          OrderStatus.PRODUCT_DELIVERED,
        ]

        const breakdown = [OrderStatus.FOR_REVIEW];

        const auction = [
          OrderStatus.FOR_APPROVAL,
          OrderStatus.WAITING,
          OrderStatus.OPEN,
          OrderStatus.DENIED,
          OrderStatus.EXPIRED,
          OrderStatus.OVERDUE,
          OrderStatus.AUCTION_ENDED,
        ];
        const step_order: any =
          order.payment.method == PaymentMethods.CBD ?
            [auction, breakdown, payment, shipping, closed] : (order.payment.method == PaymentMethods.TERMS) ?
              [auction, terms_breakdown, terms_shipping, terms_payment, closed] :
              [auction, cod_breakdown, shipping, cod_payment, closed];

        order.orders.products = order.orders.products.map((product: any) => {
          const a = products.some((p: any) => p.id == product.id);

          if (!a) return product;

          const step_index = step_order.findIndex((step: any) =>
            step.includes(product.status)
          );
          const status_index = step_order[step_index].findIndex(
            (item: any) => item == product.status
          );
          const next_status =
            status_index == step_order[step_index].length - 1 ?
              step_order[step_index + 1][0] :
              step_order[step_index][status_index + 1];

          product.status = next_status;

          return product;
        });

        const status_index = step_order.findIndex((step: any) =>
          step.includes(order.status)
        );


        console.log("status_index", status_index);

        const statuses = order.orders.products.map((product: any) => {
          return product.status;
        });

        console.log("statuses", statuses);

        const isSame = statuses.every((value: any, index: any, array: any) => {
          // console.log("isSame 1", value, array[0]);
          return value == array[0];
        });

        console.log("isSame", isSame);

        const statuses_index = step_order.findIndex((step: any) =>
          step.includes(statuses[0])
        );


        order.status = statuses[0];

        console.log("statuses_index", statuses_index);

        return order;
      }),
      switchMap(order => this.orders.save(order))
    )
  }

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
