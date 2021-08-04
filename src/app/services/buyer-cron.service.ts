import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, concat, forkJoin, from, interval, Observable, of, Subscription, timer, zip } from 'rxjs';
import { concatMap, debounceTime, delay, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AccountType, OfferStatus, OrderStatus, PaymentMethods, StepStatus } from '../helpers/classes/classes';
import { OrderService } from './order.service';
import { OrdersService } from './orders.service';
import { PaymentService } from './payment.service';
import { UsersService } from './users.service';
import { WorkflowService } from './workflow.service';

@Injectable({
  providedIn: 'root'
})
export class BuyerCronService {
  $cron!: Subscription;

  constructor(
    private orders: OrdersService,
    private workflow: WorkflowService
  ) {
    if (this.$cron) this.$cron.unsubscribe();
    this.$cron = combineLatest(
      this.orders.get(),
      interval(1000)
    ).subscribe(([orders, __]) => {
      const date = new Date();
      orders.forEach((order: any) => {
        const diff = moment.duration(moment().diff(moment(order.lastUpdated))).asSeconds();

        if (order.status == OrderStatus.FOR_DELIVERY && diff > 3) {

          const obs = order.orders.products.reduce((obs: any, product: any, index: any) => {
            product.shipping.schedules.forEach((schedule: any) => {
              obs.push(of(order).pipe(
                delay(index == 0 ? 0 : 2000),
                switchMap(order => this.workflow.shippingNext(order, product, schedule).pipe(switchMap(order => this.orders.save(order)))),
                delay(2000),
                switchMap(order => this.workflow.shippingNext(order, product, schedule).pipe(switchMap(order => this.orders.save(order)))),
              ));
            })
            return obs;
          }, []);
          console.log('obs', obs);
          zip(
            ...obs
          ).subscribe(e => {
            console.log('zip in transit', order);
          })
        }

        if (order.status == OrderStatus.SELLER_PAYMENT && diff > 3) {
          this.workflow.next(order, order.orders.products).pipe(
            take(1),
            map(order => {
              if (order.payment.method == PaymentMethods.CBD) {
                order.orders.products = order.orders.products.map((product: any) => {
                  product.shipping.schedules = product.shipping.schedules.map((sched: any) => {
                    sched.status = OrderStatus.FOR_DELIVERY;
                    return sched;
                  })
                  return product;
                })
              }
              return order;
            }),
            switchMap(order => this.orders.save(order)),
          ).subscribe(e => {
            console.log('SELLER_PAYMENT', e);
          });
        }

        if (order.status == OrderStatus.BUYER_PAYMENT_VERIFICATION && diff > 3) {
          this.workflow.next(order, order.orders.products).pipe(
            take(1),
            switchMap(order => this.orders.save(order)),
          ).subscribe(e => {
            console.log('BUYER_PAYMENT_VERIFICATION', e);
          });
        }

        if (order.status == OrderStatus.OPEN && diff > 5 && order.hasOffer && !order.hasOfferUpdated && order.hasOfferDone) {
          const obs = order.orders.products.reduce((obs: any, product: any) => {
            product.offers.forEach((offer: any, index: any) => {

              const delay_time: any = index == 0 ? 0 : this.orders.getRand(1000, 10000, 0);
              obs.push(of(order).pipe(
                delay(delay_time),
                switchMap((order) => this.updateOffer(order, product, offer)),
                switchMap((order) => this.orders.save(order))
              ));
            })
            return obs;
          }, []);

          zip(
            ...obs
          ).subscribe(e => {
            console.log('zip update', order);
          })
        }

        if (order.status == OrderStatus.OPEN && diff > 5 && !order.hasOffer) {

          const obs = order.orders.products.reduce((obs: any, product: any) => {
            product.participants.forEach((seller: any, index: any) => {

              const delay_time: any = index == 0 ? 0 : this.orders.getRand(1000, 10000, 0);
              obs.push(of(order).pipe(
                delay(delay_time),
                switchMap((order) => this.createOffer(order, product, seller)),
                switchMap((order) => this.orders.save(order))
              ));
            })
            return obs;
          }, []);

          zip(
            ...obs
          ).subscribe(e => {

            order.hasOfferDone = true;
            console.log('zip create', order);
            this.orders.save(order);
          })
        }
        if (order.status == OrderStatus.WAITING && diff > 5) {
          order.status = OrderStatus.OPEN;
          order.lastUpdated = date;
          order.orders.products.map((product: any) => {
            product.status = OrderStatus.OPEN;
            product.lastUpdated = date;
          });
          this.orders.save(order).subscribe((e) => { });
        }

        if (order.status == OrderStatus.FOR_APPROVAL && diff > 5) {
          order.status = OrderStatus.WAITING;
          order.lastUpdated = date;
          order.orders.products.map((product: any) => {
            product.status = OrderStatus.WAITING;
            product.lastUpdated = date;
          });
          this.orders.save(order).subscribe((e) => { });
        }
      });
    });
  }

  updateOffer(order: any, product: any, offer: any): Observable<any> {
    const product_index = order.orders.products.findIndex((p: any) => p.id == product.id);
    const offer_index = order.orders.products[product_index].offers.findIndex((o: any) => o.id == offer.id);

    const copy_price = JSON.parse(JSON.stringify(order.orders.products[product_index].offers[offer_index].currentPrice));
    const perUnit = this.orders.getRand(30, 35, 4);
    const freightUnit = this.orders.getRand(0, 5, 4);

    const price = Object.assign(copy_price, {
      subtotal: (perUnit + freightUnit) * product.qty,
      perUnit: perUnit,
      freightUnit: freightUnit,
      perUnitTotal: perUnit * product.qty,
      freightUnitTotal: freightUnit * product.qty,
    });

    order.orders.products[product_index].offers[offer_index].currentPrice = price;
    order.orders.products[product_index].offers[offer_index].prices.push(price);
    order.hasOfferUpdated = true;
    return of(order).pipe(tap((o) => {
      console.log('tap update', o, new Date());
    }));
  }

  createOffer(order: any, product: any, seller: any): Observable<any> {
    const index = order.orders.products.findIndex((p: any) => p.id == product.id);
    const _product = order.orders.products.find((p: any) => p.id == product.id);

    const expiration = moment(order.startDate).add(order.duration, 'hours');

    const date = new Date();
    const perUnit = this.orders.getRand(30, 35, 4);
    const freightUnit = this.orders.getRand(0, 5, 4);
    const price = {
      advisorRate: 0,
      currency: order.transaction.currency,
      notes: `note ${seller.companyName}`,
      attachments: [],
      dueDate: expiration.format('L'),
      dueTime: expiration.format('LT'),
      expiration: expiration,
      subtotal: (perUnit + freightUnit) * product.qty,
      perUnit: perUnit,
      freightUnit: freightUnit,
      perUnitTotal: perUnit * product.qty,
      freightUnitTotal: freightUnit * product.qty,
      adjustments: {
        com: 0,
        hedge: 0,
        freight: 0,
        freightRevenue: 0,
        freightRevenueRate: 0.0,
        storage: 0,
        markToMarket: 0,
      }
    };

    const offer = {
      id: (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase(),
      alias: _product.offers ? _product.offers.length + 1 : 1,
      user: seller,
      currentPrice: price,
      prices: [price],
      dateCreated: date,
      lastUpdated: date,
      status: OfferStatus.OPEN
    };

    if (!order.orders.products[index].offers) {
      order.orders.products[index].offers = [];
    }

    order.hasOffer = true;

    order.orders.products[index].offers.push(offer);

    return of(order).pipe(tap((o) => {
      console.log('tap create', o, new Date());
    }));

  }

}
