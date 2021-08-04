import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, concat, forkJoin, from, interval, Observable, of, Subscription, timer, zip } from 'rxjs';
import { concatMap, debounceTime, delay, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AccountType, OfferStatus, OrderStatus, PaymentMethods, StepStatus } from '../helpers/classes/classes';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { UsersService } from './users.service';
import { WorkflowService } from './workflow.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  ORDERS_STORAGE = 'demo_orders_storage';

  orders$: BehaviorSubject<any> = new BehaviorSubject([]);
  $cron!: Subscription;

  constructor(
    private order: OrderService,
    private users: UsersService,
    private workflow: WorkflowService
  ) {
    this.retrieve();
  }

  get(): Observable<any> {
    return this.orders$.asObservable();
  }

  getRand(min: any, max: any, decimalPlaces: any) {
    var rand = Math.random() < 0.5 ? ((1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);  // could be min or max or anything in between
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  find(id: string): Observable<any> {
    if (!id) {
      return new Observable((obs) => {
        obs.next(undefined);
        obs.complete();
      })
    }
    return this.orders$.pipe(
      map((orders: any) => {
        const order = orders.find((order: any) => order._id == id);
        return order;
      }),
      tap(order => this.order.set(order))
    );
  }

  retrieve(): void {
    const orders = JSON.parse(sessionStorage.getItem(this.ORDERS_STORAGE) as string);
    this.orders$.next(orders || this.orders$.value);
  }

  save(order: any): Observable<any> {
    // console.log('save >>>>', order);
    return this.orders$.pipe(
      take(1),
      map(orders => {
        console.log('wew >>>', orders);
        const id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
        const date = new Date();
        if (order._id) {
          const orderIndex = orders.findIndex((t: any) => t._id == order._id);
          order.lastUpdated = date;
          orders[orderIndex] = order;
        } else {
          order._id = id;
          order.batchId = orders.length + 1;
          order.dateCreated = date;
          order.lastUpdated = date;
          orders.push(order);
        }

        console.log('save', orders);
        sessionStorage.setItem(this.ORDERS_STORAGE, JSON.stringify(orders));
        this.orders$.next(orders);
        return order;
      })
    )
  }

  generateSteps(order: any, mode: AccountType): any {
    const orders = order.orders;
    const paymentMethod = order.payment.method;
    const steps = [];

    const closed = [
      // OrderStatus.DELIVERY_CONFIRMATION,
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

    const cod_payment = [
      OrderStatus.FOR_BUYER_PAYMENT,
      OrderStatus.BUYER_PAYMENT_VERIFICATION,
    ];

    const terms_payment = [
      OrderStatus.FOR_BUYER_PAYMENT,
      OrderStatus.BUYER_PAYMENT_VERIFICATION,
      OrderStatus.SELLER_PAYMENT,
      OrderStatus.SELLER_PAYMENT_VERIFICATION,
    ];

    const terms_breakdown = [
      OrderStatus.FOR_REVIEW
    ];

    const breakdown = [OrderStatus.FOR_REVIEW];

    const cod_breakdown = [
      OrderStatus.FOR_REVIEW,
      OrderStatus.SELLER_PAYMENT,
    ];

    const auction = [
      OrderStatus.FOR_APPROVAL,
      OrderStatus.WAITING,
      OrderStatus.OPEN,
      OrderStatus.DENIED,
      OrderStatus.EXPIRED,
      OrderStatus.OVERDUE,
      OrderStatus.AUCTION_ENDED,
    ];

    const seller_cod_payment = [
      OrderStatus.FOR_REVIEW,
      OrderStatus.SELLER_PAYMENT,
    ];

    const seller_terms_payment = [
      OrderStatus.FOR_BUYER_PAYMENT,
      OrderStatus.BUYER_PAYMENT_VERIFICATION,
      OrderStatus.SELLER_PAYMENT,
      OrderStatus.SELLER_PAYMENT_VERIFICATION,
    ];

    const seller_terms_shipping = [
      OrderStatus.FOR_REVIEW,
      OrderStatus.FOR_DELIVERY,
      OrderStatus.IN_TRANSIT,
      OrderStatus.PRODUCT_DELIVERED,
    ];

    const seller_cbd_payment = [
      OrderStatus.FOR_REVIEW,
      OrderStatus.FOR_BUYER_PAYMENT,
      OrderStatus.BUYER_PAYMENT_VERIFICATION,
      OrderStatus.SELLER_PAYMENT,
    ];

    const seller_cod_shipping = [
      OrderStatus.FOR_DELIVERY,
      OrderStatus.IN_TRANSIT,
      OrderStatus.PRODUCT_DELIVERED,
      OrderStatus.FOR_BUYER_PAYMENT,
      OrderStatus.BUYER_PAYMENT_VERIFICATION,
    ];


    const seller_cbd_shipping = [
      OrderStatus.FOR_DELIVERY,
      OrderStatus.IN_TRANSIT,
      OrderStatus.PRODUCT_DELIVERED,
    ];

    // console.log('mode', mode)

    if (mode == AccountType.SELLER) {
      var step_order: any = [];

      if (paymentMethod == PaymentMethods.TERMS) {
        step_order = [
          auction,
          seller_terms_shipping,
          seller_terms_payment,
          closed,
        ];
      } else {
        step_order = [
          auction,
          paymentMethod == PaymentMethods.CBD
            ? seller_cbd_payment
            : seller_cod_payment,
          paymentMethod == PaymentMethods.CBD
            ? seller_cbd_shipping
            : seller_cod_shipping,
          closed,
        ];
      }

      console.log('step_order', step_order)


      const step_index = step_order.findIndex((step: any) =>
        step.includes(order.status)
      );

      steps.push({
        label: "Auction",
        status:
          step_index == 0
            ? StepStatus.ONGOING
            : step_index < 0
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "auction",
      });


      if (paymentMethod == PaymentMethods.TERMS) {
        steps.push({
          label: "Shipping",
          status:
            step_index == 1
              ? StepStatus.ONGOING
              : step_index < 1
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "shipping",
        });

        steps.push({
          label: "Payment",
          status:
            step_index == 2
              ? StepStatus.ONGOING
              : step_index < 2
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "payment",
        });

      } else {
        steps.push({
          label: "Payment",
          status:
            step_index == 1
              ? StepStatus.ONGOING
              : step_index < 1
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "payment",
        });
        steps.push({
          label: "Shipping",
          status:
            step_index == 2
              ? StepStatus.ONGOING
              : step_index < 2
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "shipping",
        });
      }

      steps.push({
        label: "Closed Deal",
        status: step_index == 3 ? StepStatus.COMPLETE : StepStatus.INCOMPLETE,
        routerLink: "closed",
      });


      return steps;
    }

    if (paymentMethod == PaymentMethods.CBD) {
      const step_order: any = [auction, breakdown, payment, shipping, closed];
      const step_index = step_order.findIndex((step: any) =>
        step.includes(order.status)
      );
      // console.log(step_index, order.status);
      steps.push({
        label: "Auction",
        status:
          step_index == 0
            ? StepStatus.ONGOING
            : step_index < 0
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "auction",
      });
      steps.push({
        label: "Breakdown",
        status:
          step_index == 1
            ? StepStatus.ONGOING
            : step_index < 1
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "breakdown",
      });
      steps.push({
        label: "Payment",
        status:
          step_index == 2
            ? StepStatus.ONGOING
            : step_index < 2
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "payment",
      });
      steps.push({
        label: "Shipping",
        status:
          step_index == 3
            ? StepStatus.ONGOING
            : step_index < 3
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "shipping",
      });
      steps.push({
        label: "Closed Deal",
        status:
          step_index == 4 && order.status !== OrderStatus.CLOSED_DEAL
            ? StepStatus.ONGOING
            : step_index < 4
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "closed",
      });
      return steps;
    }

    if (paymentMethod == PaymentMethods.COD) {
      const step_order: any = [
        auction,
        cod_breakdown,
        shipping,
        cod_payment,
        closed,
      ];

      const step_index = step_order.findIndex((step: any) =>
        step.includes(order.status)
      );

      steps.push({
        label: "Auction",
        status:
          step_index == 0
            ? StepStatus.ONGOING
            : step_index < 0
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "auction",
      });
      steps.push({
        label: "Breakdown",
        status:
          step_index == 1
            ? StepStatus.ONGOING
            : step_index < 1
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "breakdown",
      });
      steps.push({
        label: "Shipping",
        status:
          step_index == 2
            ? StepStatus.ONGOING
            : step_index < 2
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "shipping",
      });
      steps.push({
        label: "Payment",
        status:
          step_index == 3
            ? StepStatus.ONGOING
            : step_index < 3
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "payment",
      });
      steps.push({
        label: "Closed Deal",
        status: step_index == 4 ? StepStatus.COMPLETE : StepStatus.INCOMPLETE,
        routerLink: "closed",
      });
      return steps;
    }

    if (paymentMethod == PaymentMethods.TERMS) {
      const step_order: any = [
        auction,
        terms_breakdown,
        shipping,
        terms_payment,
        closed,
      ];

      const step_index = step_order.findIndex((step: any) =>
        step.includes(order.status)
      );

      steps.push({
        label: "Auction",
        status:
          step_index == 0
            ? StepStatus.ONGOING
            : step_index < 0
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "auction",
      });
      steps.push({
        label: "Breakdown",
        status:
          step_index == 1
            ? StepStatus.ONGOING
            : step_index < 1
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "breakdown",
      });
      steps.push({
        label: "Shipping",
        status:
          step_index == 2
            ? StepStatus.ONGOING
            : step_index < 2
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "shipping",
      });
      steps.push({
        label: "Payment",
        status:
          step_index == 3
            ? StepStatus.ONGOING
            : step_index < 3
              ? StepStatus.INCOMPLETE
              : StepStatus.COMPLETE,
        routerLink: "payment",
      });
      steps.push({
        label: "Closed Deal",
        status: step_index == 4 ? StepStatus.COMPLETE : StepStatus.INCOMPLETE,
        routerLink: "closed",
      });
      return steps;
    }
  }

}
