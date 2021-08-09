import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { OfferStatus, ShippingMethod } from 'src/app/helpers/classes/classes';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'offer-page',
  templateUrl: './offer-page.component.html',
  styleUrls: ['./offer-page.component.scss']
})
export class OfferPageComponent implements OnInit {

  form!: FormGroup;
  routeParams!: Subscription;
  order$!: Observable<any>;
  offer$!: Observable<any>;
  pricePerUnit$!: Observable<any>;
  freightPerUnit$!: Observable<any>;
  enabled$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private order: OrderService,
    private orders: OrdersService,
    private user: UserService,
    private decimal: DecimalPipe,
    private iziToast: NgxIzitoastService,
  ) {
    this.form = this.fb.group({});
  }

  onSubmit() {
    console.log('submit');

    if (!this.form.valid) {
      this.iziToast.show({
        title: 'ERROR',
        titleColor: '#933432',
        titleSize: '13',
        message: 'Incomplete Details',
        messageColor: '#933432',
        messageSize: '13',
        position: 'bottomRight',
        backgroundColor: '#fddddd',
      });
      return;
    }

    this.iziToast.show({
      title: 'Proceed',
      message: `Are you sure you want to proceed?`,
      position: 'center',
      closeOnEscape: false,
      close: false,
      overlay: true,
      timeout: 0,
      buttons: [
        ['<button>Confirm</button>', (instance: any, toast: any) => {
          instance.hide({
            transitionOut: 'fadeOutUp',
            onClosing: (instance: any, toast: any, closedBy: any) => {
              combineLatest(
                this.order$,
                this.user.get(),
                this.route.params
              ).pipe(
                take(1),
                filter(([order, user, params]) => {
                  const today = moment(new Date());
                  const expiration = moment(`${this.form.value.dueDate} ${this.form.value.dueTime}`);
                  var diff = moment.duration(expiration.diff(today)).asMinutes();
                  if (diff < 30) {
                    this.iziToast.show({
                      title: 'ERROR',
                      titleColor: '#933432',
                      titleSize: '13',
                      message: 'Due Date too short',
                      messageColor: '#933432',
                      messageSize: '13',
                      position: 'bottomRight',
                      backgroundColor: '#fddddd',
                    });
                  }
                  return diff > 30;
                }),
                map(([order, user, params]) => {



                  const date = new Date();
                  const product = order.orders.products.find((product: any) => product.id == params.product_id);
                  const offered = product.offers.find((offer: any) => offer.user.id == user._id);

                  const perUnit = parseFloat(this.form.value.perUnit.replace(/php|usd|,/gi, "")) / 1.12;
                  const freightUnit = parseFloat(this.form.value.freightUnit.replace(/php|usd|,/gi, "")) / 1.12;
                  const notes = this.form.value.notes;

                  if (offered) {

                    const product_index = order.orders.products.findIndex((p: any) => p.id == product.id);
                    const offer_index = order.orders.products[product_index].offers.findIndex((o: any) => o.user.id == user._id);
                    console.log('offered', product_index, offer_index);
                    const copy_price = JSON.parse(JSON.stringify(order.orders.products[product_index].offers[offer_index].currentPrice));

                    const price = Object.assign(copy_price, {
                      subtotal: (perUnit + freightUnit) * product.qty,
                      perUnit: perUnit,
                      freightUnit: freightUnit,
                      perUnitTotal: perUnit * product.qty,
                      freightUnitTotal: freightUnit * product.qty,
                    });

                    order.orders.products[product_index].offers[offer_index].currentPrice = price;
                    order.orders.products[product_index].offers[offer_index].prices.push(price);
                    order.orders.products[product_index].hasUpdated = true;

                    const hasUpdated = order.orders.products.every((product: any) => {
                      return product.hasUpdated
                    });

                    if (hasUpdated) {
                      order.hasUpdated = true;
                    }

                  } else {

                    const index = order.orders.products.findIndex((p: any) => p.id == product.id);
                    const price = {
                      advisorRate: 0,
                      currency: order.transaction.currency,
                      notes: notes,
                      attachments: [],
                      dueDate: this.form.value.dueDate,
                      dueTime: this.form.value.dueTime,
                      expiration: `${this.form.value.dueDate} ${this.form.value.dueTime}`,
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
                      alias: product.offers ? product.offers.length + 1 : 1,
                      user: product.participants.find((p: any) => p.id == user._id),
                      currentPrice: price,
                      prices: [price],
                      dateCreated: date,
                      lastUpdated: date,
                      status: OfferStatus.OPEN
                    };

                    order.orders.products[index].offers.push(offer);
                    order.orders.products[index].hasOffer = true;
                  }

                  console.log('order >>>', order);

                  return order;
                }),
                switchMap(order => this.orders.save(order))
              ).subscribe(e => {

                this.router.navigate(['../'], { relativeTo: this.route });
              })

            }
          }, toast, 'buttonName');
        }, true],
        ['<button>Cancel</button>', (instance: any, toast: any) => {
          instance.hide({
            transitionOut: 'fadeOutUp'
          }, toast, 'buttonName');
        }]
      ],
    });

  }

  ngOnInit(): void {

    this.order$ = this.order.get().pipe(filter(order => order));

    this.routeParams = combineLatest(
      this.order$,
      this.route.params
    ).subscribe(([order, params]) => {

      console.log('params', order);
      switch (order.shipping.method) {
        case ShippingMethod.DELIVER:
          this.form = this.fb.group({
            perUnit: [`${order.transaction.currency} 0`, Validators.required],
            freightUnit: [`${order.transaction.currency} 0`, Validators.required],
            dueDate: [
              moment(new Date()).format("MM/DD/YYYY"),
              Validators.required,
            ],
            dueTime: ["12:00 AM", Validators.required],
            notes: [""],
            attachments: this.fb.array([]),
          });
          break;

        case ShippingMethod.PICKUP:
          this.form = this.fb.group({
            perUnit: [`${order.transaction.currency} 0`, Validators.required],
            dueDate: [
              moment(new Date()).format("MM/DD/YYYY"),
              Validators.required,
            ],
            dueTime: ["12:00 AM", Validators.required],
            notes: [""],
            attachments: this.fb.array([]),
          });
          break;
      }

      this.pricePerUnit$ = this.form.valueChanges.pipe(
        startWith({ perUnit: `${order.transaction.currency} 0` }),
        map((form) => {
          return (
            parseFloat(form["perUnit"].replace(/php|usd|,/gi, "")) / 1.12 || 0
          );
        })
      );

      this.freightPerUnit$ = this.form.valueChanges.pipe(
        startWith({ freightUnit: `${order.transaction.currency} 0` }),
        map((form) => {
          return (
            parseFloat(form["freightUnit"].replace(/php|usd|,/gi, "")) / 1.12 ||
            0
          );
        })
      );

      this.offer$ = combineLatest(
        this.order$,
        this.user.get(),
      ).pipe(
        map(([order, user]) => {
          const product = order.orders.products.find((product: any) => product.id == params.product_id);
          return product.offers.find((offer: any) => {
            return offer.user.id == user._id;
          })

        }),
      );

      this.offer$.pipe(take(1)).subscribe(offer => {
        if (!offer) return;

        if (order.shipping.method == "Deliver") {
          this.form.patchValue({
            dueDate: !offer.currentPrice.dueDate ? moment(new Date()).format("MM/DD/YYYY") : offer.currentPrice.dueDate,
            dueTime: !offer.currentPrice.dueTime ? "12:00 AM" : offer.currentPrice.dueTime,
            perUnit: `${order.transaction.currency} ${this.decimal.transform(offer.currentPrice.perUnit * 1.12 || 0, "1.4-4")}`,
            freightUnit: `${order.transaction.currency} ${this.decimal.transform(offer.currentPrice.freightUnit * 1.12 || 0, "1.4-4")}`,
            notes: offer.currentPrice.notes || "",
          });

          if (offer.currentPrice.attachments) {
            offer.currentPrice.attachments.forEach((attachment: any) => {
              (<FormArray>this.form.get('attachments')).push(new FormControl(attachment));
            });
          }
        } else {
          this.form.patchValue({
            dueDate: !offer.currentPrice.dueDate ? moment(new Date()).format("MM/DD/YYYY") : offer.currentPrice.dueDate,
            dueTime: !offer.currentPrice.dueTime ? "12:00 AM" : offer.currentPrice.dueTime,
            perUnit: `${order.transaction.currency} ${this.decimal.transform(offer.currentPrice.perUnit * 1.12 || 0, "1.4-4")}`,
            notes: offer.currentPrice.notes || "",
          });

          if (offer.currentPrice.attachments) {
            offer.currentPrice.attachments.forEach((attachment: any) => {
              (<FormArray>this.form.get('attachments')).push(new FormControl(attachment));
            });
          }

        }
      })

      this.enabled$ = this.offer$.pipe(
        map((offer: any) => {
          if (!offer) return true;
          const offerLen = offer.prices.length;
          return offerLen < 5;
        })
      )

    })
  }

}
