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
export class WorkflowService {

  constructor(
    private user: UserService
  ) { }

  shippingNext(order: any, product: any, schedule: any): Observable<any> {
    // order = JSON.parse(JSON.stringify(order));
    // product = JSON.parse(JSON.stringify(product));
    // schedule = JSON.parse(JSON.stringify(schedule));
    const shipping = [
      OrderStatus.FOR_DELIVERY,
      OrderStatus.IN_TRANSIT,
      OrderStatus.PRODUCT_DELIVERED,
      OrderStatus.CLOSED_DEAL
    ];

    const cod_next = OrderStatus.FOR_BUYER_PAYMENT;
    const cbd_next = OrderStatus.CLOSED_DEAL;
    const terms_next = OrderStatus.FOR_BUYER_PAYMENT;

    // const product_index = order.orders.products.findIndex((p:any) => p.id == product.id);
    // const sched_index = schedules.findIndex((schedule:any) => schedule.id == schedule.id);

    const isSchedulesFresh = product.shipping.schedules.every((s: any) => s.status == OrderStatus.FOR_DELIVERY);

    const isProductsFresh = order.orders.products.every((p: any) => p.status == OrderStatus.FOR_DELIVERY);

    const curr_status_index = shipping.findIndex(status => schedule.status == status);

    const final_status = (PaymentMethods.COD == order.payment.method ? cod_next : (PaymentMethods.TERMS == order.payment.method ? terms_next : cbd_next));

    // schedules[sched_index].status = shipping[curr_status_index + 1];

    product.shipping.schedules = product.shipping.schedules.map((s: any) => {
      if (s.id == schedule.id) {
        s.status = shipping[curr_status_index + 1];
      }
      return s;
    })

    const isSchedulesComplete = product.shipping.schedules.every((s: any) => s.status == OrderStatus.CLOSED_DEAL);

    const isProductsComplete = order.orders.products.every((p: any) => {
      if (p.id == product.id) {
        p.shipping.schedules = product.shipping.schedules;
      }
      return p.shipping.schedules.every((s: any) => s.status == OrderStatus.CLOSED_DEAL);
    });

    if (isProductsFresh) {
      order.status = OrderStatus.IN_TRANSIT;
    }
    if (isSchedulesFresh) {
      order.orders.products = order.orders.products.map((p: any) => {
        if (p.id == product.id) {
          p.status = OrderStatus.IN_TRANSIT
        }
        return p;
      })
    }
    if (isSchedulesComplete) {
      order.orders.products = order.orders.products.map((p: any) => {
        if (p.id == product.id) {
          p.status = OrderStatus.PRODUCT_DELIVERED
        }
        return p;
      })

    }
    if (isProductsComplete) {
      order.status = final_status;

      order.orders.products = order.orders.products.map((p: any) => {
        p.status = final_status;
        return p
      });

    }
    console.log('shipping next >>>', order)
    return of(order);
  }

  next(order: any, products: any): Observable<any> {
    return this.user.get().pipe(
      take(1),
      map((user) => {
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
          console.log('step index', step_order, step_index)
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


        // console.log("status_index", status_index);

        const statuses = order.orders.products.map((product: any) => {
          return product.status;
        });

        // console.log("statuses", statuses);

        const isSame = statuses.every((value: any, index: any, array: any) => {
          // console.log("isSame 1", value, array[0]);
          return value == array[0];
        });

        // console.log("isSame", isSame);

        const statuses_index = step_order.findIndex((step: any) =>
          step.includes(statuses[0])
        );


        order.status = statuses[0];

        console.log("shipping next", JSON.parse(JSON.stringify(order)));

        return order;
      })
    )
  }
}
