import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, concat, forkJoin, from, interval, Observable, of, Subscription, timer, zip } from 'rxjs';
import { concatMap, debounceTime, delay, flatMap, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { AccountType, OfferStatus, OrderStatus, PaymentMethods, StepStatus } from '../helpers/classes/classes';
import { OrderService } from './order.service';
import { OrdersService } from './orders.service';
import { PaymentService } from './payment.service';
import { UserService } from './user.service';
import { UsersService } from './users.service';
import { WorkflowService } from './workflow.service';

@Injectable({
  providedIn: 'root'
})
export class SellerCronService {
  $cron!: Subscription;

  constructor(
    private orders: OrdersService,
    private user: UserService,
    private workflow: WorkflowService
  ) {

    if (this.$cron) this.$cron.unsubscribe();
    this.$cron = combineLatest(
      this.orders.get(),
      this.user.get(),
      interval(1000)
    ).subscribe(([orders, user, __]) => {
      // console.log('seller cron >>> orders', user, orders);

      if (!orders.length) {
        console.log('no order');
        this.orders.save(this.createOrder()).subscribe(e => {
          console.log('new order >>>');
        });
        return;
      }

      const date = new Date();

      orders.forEach((order: any) => {
        const diff = moment.duration(moment().diff(moment(order.lastUpdated))).asSeconds();
        // console.log('order >>>', order, diff)

        if (order.status == OrderStatus.PRODUCT_DELIVERED && diff > 5) {
          // return;
          order.orders.products = order.orders.products.map((product: any) => {
            product.status = OrderStatus.CLOSED_DEAL;
            product.shipping.schedules = product.shipping.schedules.map((schedule: any) => {
              schedule.status = OrderStatus.CLOSED_DEAL;
              return schedule;
            })
            return product;
          })
          order.lastUpdated = date;
          order.status = OrderStatus.CLOSED_DEAL;
          this.orders.save(order).subscribe(e => console.log('closed', e));
        }

        if (order.status == OrderStatus.SELLER_PAYMENT && diff > 5) {
          order.orders.products = order.orders.products.map((product: any) => {
            product.status = OrderStatus.FOR_DELIVERY;

            product.shipping.schedules = product.shipping.schedules.map((schedule: any) => {
              schedule.status = OrderStatus.FOR_DELIVERY;
              return schedule;
            })
            return product;
          })
          order.lastUpdated = date;
          order.status = OrderStatus.FOR_DELIVERY;
          this.orders.save(order).subscribe(e => console.log('for delivery', e));
        }
        if (order.status == OrderStatus.FOR_REVIEW && diff > 3) {
          order.orders.products = order.orders.products.map((product: any) => {
            product.status = OrderStatus.SELLER_PAYMENT;
            return product;
          })
          order.lastUpdated = date;
          order.status = OrderStatus.SELLER_PAYMENT;
          this.orders.save(order).subscribe(e => console.log('for seller payment', e));
        }
        if (order.status == OrderStatus.OPEN && order.hasUpdated && diff > 5) {
          // console.log('updated >>>>');
          order.orders.products = order.orders.products.map((product: any) => {
            product.selectedPrice = product.offers.find((o: any) => o.user.id == user._id);
            product.status = OrderStatus.FOR_REVIEW;
            return product;
          })
          order.lastUpdated = date;
          order.status = OrderStatus.FOR_REVIEW;


          console.log('updated >>>', order);

          this.orders.save(order).subscribe(e => console.log('for review', e));
        }

        if (order.status == OrderStatus.OPEN && order.hasOfferDone && diff > 5) {
          const obs = order.orders.products.reduce((obs: any, product: any) => {

            const participants = product.participants.filter((participant: any) => {
              return participant.id !== user._id;
            });

            const user_offer = product.offers.find((offer: any) => offer.user.id == user._id);

            if (product.hasOffer && !product.hasOfferDone) {

              participants.forEach((seller: any, index: any) => {
                const delay_time: any = index == 0 ? 0 : this.orders.getRand(1000, 10000, 0);
                const offer = product.offers.find((o: any) => o.user.id == seller.id)
                obs.push(of(order).pipe(
                  delay(delay_time),
                  switchMap((order) => this.updateOffer(order, product, offer, user_offer)),
                  switchMap((order) => {

                    order.orders.products = order.orders.products.map((p: any) => {
                      if (product.id == p.id) {
                        p.hasOfferDone = true;
                      }
                      return p;
                    });

                    return this.orders.save(order);
                  })
                ));
              })
            }
            return obs;
          }, []);


          zip(
            ...obs
          ).subscribe(e => {

          })
        }

        if (order.status == OrderStatus.OPEN && !order.hasOffer && diff > 2) {
          const obs = order.orders.products.reduce((obs: any, product: any) => {

            const participants = product.participants.filter((participant: any) => {
              return participant.id !== user._id;
            });

            participants.forEach((seller: any, index: any) => {
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

        // if (order.status == OrderStatus.FOR_APPROVAL && diff > 2) {
        //   order.status = OrderStatus.OPEN;
        //   order.lastUpdated = date;
        //   order.orders.products.map((product: any) => {
        //     product.status = OrderStatus.OPEN;
        //     product.lastUpdated = date;
        //   });
        //   this.orders.save(order).subscribe((e) => { });
        // }
      })

    });

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
    order.lastUpdated = date;
    order.orders.products[index].offers.push(offer);

    return of(order).pipe(tap((o) => {
      console.log('tap create', o, new Date());
    }));

  }


  updateOffer(order: any, product: any, offer: any, user_offer: any): Observable<any> {
    const date = new Date();
    const product_index = order.orders.products.findIndex((p: any) => p.id == product.id);
    const offer_index = order.orders.products[product_index].offers.findIndex((o: any) => o.id == offer.id);
    const copy_price = JSON.parse(JSON.stringify(order.orders.products[product_index].offers[offer_index].currentPrice));
    const perUnit = this.orders.getRand(user_offer.currentPrice.perUnit - 1, user_offer.currentPrice.perUnit, 4);
    const freightUnit = this.orders.getRand(0, user_offer.currentPrice.freightUnit, 4);

    const price = Object.assign(copy_price, {
      subtotal: (perUnit + freightUnit) * product.qty,
      perUnit: perUnit,
      freightUnit: freightUnit,
      perUnitTotal: perUnit * product.qty,
      freightUnitTotal: freightUnit * product.qty,
    });

    order.orders.products[product_index].offers[offer_index].currentPrice = price;
    order.orders.products[product_index].offers[offer_index].prices.push(price);
    order.orders.products[product_index].offers[offer_index].hasUpdated = true;
    order.lastUpdated = date;
    return of(order).pipe(tap((o) => {
      console.log('tap update', o, new Date());
    }));
  }

  createOrder(): any {
    const order: any = {
      "hasOffer": false,
      "shipping": {
        "method": "Deliver",
        "isSameLocation": true
      },
      "payment": {
        "method": "Cash before delivery",
        "option": "Bank Transfer",
        "channel": "Upload deposit slip",
        "days": ""
      },
      "orders": {
        "commodity": "Petroleum",
        "products": [
          {
            "product": "Automotive Diesel Oil",
            "type": "",
            "qty": 12000,
            "unit": "Liters",
            "shipping": {
              "location": "LapuLapu",
              "region": "Region VII - Central Visayas",
              "province": "Cebu",
              "schedules": [
                {
                  "id": "NAN8393F5F",
                  "qty": "12,000",
                  "unit": "Liters",
                  "date": "08/31/2021",
                  "time": "12:00 AM"
                }
              ]
            },
            "notes": "test",
            "participants": [
              {
                "id": "seller-demo-a",
                "email": "demo.seller.a@gmail.com",
                "groupName": "Demo Seller A",
                "companyName": "Demo Seller A",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              },
              {
                "id": "seller-demo-b",
                "email": "demo.seller.b@gmail.com",
                "groupName": "Demo Seller B",
                "companyName": "Demo Seller B",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              },
              {
                "id": "seller-demo-c",
                "email": "demo.seller.c@gmail.com",
                "groupName": "Demo Seller C",
                "companyName": "Demo Seller C",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              }
            ],
            "attachments": [

            ],
            "id": "KRWNMF8K3797EMV",
            "status": "Open",
            "offers": []
          },
          {
            "product": "Unleaded Gasoline",
            "type": "",
            "qty": 8000,
            "unit": "Liters",
            "shipping": {
              "location": "LapuLapu",
              "region": "Region VII - Central Visayas",
              "province": "Cebu",
              "schedules": [
                {
                  "id": "NAN4319ODC",
                  "qty": "8,000",
                  "unit": "Liters",
                  "date": "08/31/2021",
                  "time": "12:00 AM"
                }
              ]
            },
            "notes": "test",
            "participants": [
              {
                "id": "seller-demo-a",
                "email": "demo.seller.a@gmail.com",
                "groupName": "Demo Seller A",
                "companyName": "Demo Seller A",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              },
              {
                "id": "seller-demo-b",
                "email": "demo.seller.b@gmail.com",
                "groupName": "Demo Seller B",
                "companyName": "Demo Seller B",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              },
              {
                "id": "seller-demo-c",
                "email": "demo.seller.c@gmail.com",
                "groupName": "Demo Seller C",
                "companyName": "Demo Seller C",
                "mobileNo": {
                  "countryCode": "63",
                  "number": "9171340492"
                }
              }
            ],
            "attachments": [

            ],
            "id": "KRWNMF8K52579QY",
            "status": "Open",
            "offers": []
          }
        ]
      },
      "startDate": "2021-08-31T06:25:00.000Z",
      "duration": 40,
      "dateCreated": "2021-08-03T22:50:48.557Z",
      "dateApproved": null,
      "user": {
        "fullName": "Buyer Dealogikal",
        "companyName": "Dealo Buyer Inc.",
        "email": "demo.buyer@gmail.com",
        "mobileNo": {
          "countryCode": "63",
          "number": "9479915803"
        }
      },
      "status": "Open",
      "transaction": {
        "currency": "PHP",
        "isSpecialUser": false,
        "processingRate": 0.3,
        "taxType": "VAT Registered",
        "alias": 0,
        "batchId": 0,
        "user": {
          "fullName": "Buyer Dealogikal",
          "companyName": "Dealo Buyer Inc.",
          "email": "demo.buyer@gmail.com",
          "mobileNo": {
            "countryCode": "63",
            "number": "9479915803"
          },
          "cas": "Pt2rzgQw77Lgy2QgQ"
        }
      },
      "adminReview": {
        "userId": "",
        "date": "2021-08-03T22:50:48.559Z",
        "notes": ""
      },
      "warningNotif": {
        "hours_5": false,
        "hours_2": false
      },
      "comments": [

      ],
      "changeLog": [

      ],
      "alias": 0,
      "batchId": 0
    };
    order.startDate = moment().add(7, 'hours').format();
    const shipping_date = moment().add(3, 'days').format();
    order.orders.products = order.orders.products.map((product: any) => {

      product.shipping.schedules = product.shipping.schedules.map((schedules: any) => {
        schedules.date = moment(shipping_date).format('L');
        return schedules;
      })
      return product;
    })

    return order;
  }
}
