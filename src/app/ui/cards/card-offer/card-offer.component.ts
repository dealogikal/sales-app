import { DecimalPipe } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { AccountType, COLOR, OfferStatus, OrderStatus, TaxRateType } from 'src/app/helpers/classes/classes';
import { NoComma } from 'src/app/helpers/pipes/pipe';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'card-offer',
  templateUrl: './card-offer.component.html',
  styleUrls: ['./card-offer.component.scss']
})
export class CardOfferComponent implements OnInit {

  @HostBinding('class.selected') selected = false;

  offer$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  selected$: BehaviorSubject<any> = new BehaviorSubject(false);

  date$!: Observable<any>;
  duration$!: Observable<any>;
  actions$!: Observable<any>;
  displayOffer$!: Observable<any>;

  @Input()
  set data(value: any) {
    // console.log('CardOfferComponent', value);
    this.offer$.next(value);
  }

  @Input() shippingMethod!: String;

  constructor(
    private user: UserService,
    private order: OrderService,
    private iziToast: NgxIzitoastService,
    private checkout: CheckoutService
  ) { }

  ngOnInit(): void {

    combineLatest(
      this.checkout.get(),
      this.offer$,
      this.order.get()
    ).subscribe(([items, offer, order]) => {
      const checkout_selected = items.some((item: any) => item.id == offer.id);
      const product = order.orders.products.find((p: any) => p.id == offer.product_id);

      // console.log('product >>>', offer.id, product);
      if (product.hasOwnProperty('selectedPrice')) {
        if (product.selectedPrice.id == offer.id) this.selected = true;
        return;
      }

      if (checkout_selected) this.selected = true;
      else this.selected = false;
    });

    this.displayOffer$ = combineLatest(
      this.order.get(),
      this.offer$,
    ).pipe(
      map(([order, offer]) => {
        // console.log('orderssss', order)
        let _offer = JSON.parse(JSON.stringify(offer));
        const tax_multiplier = TaxRateType.VAT_REGISTERED == order.transaction.taxType ? 1.12 : 0;
        _offer.currentPrice.subtotal = _offer.currentPrice.subtotal * tax_multiplier;
        _offer.currentPrice.perUnit = _offer.currentPrice.perUnit * tax_multiplier;
        _offer.currentPrice.freightUnit = _offer.currentPrice.freightUnit * tax_multiplier;
        _offer.currentPrice.perUnitTotal = _offer.currentPrice.perUnitTotal * tax_multiplier;
        _offer.currentPrice.freightUnitTotal = _offer.currentPrice.freightUnitTotal * tax_multiplier;

        return _offer;
      })
    )

    this.date$ = combineLatest(
      this.offer$,
      timer(0, 60000),
      (data: any) => data
    ).pipe(
      map((offer: any) => {
        return moment(offer.currentPrice.date).fromNow();
      })
    );

    this.duration$ = combineLatest(
      this.offer$,
      this.order.get(),
      timer(0, 1000),
    ).pipe(
      filter(([offer, order, __]) => {
        return [OfferStatus.OPEN].indexOf(offer.status) !== -1 && [OrderStatus.OPEN, OrderStatus.AUCTION_ENDED].indexOf(order.status) !== -1;
      }),
      map(([offer, order, __]) => {
        // console.log("duration$", order);
        const due = moment(offer.currentPrice.expiration).format();
        // console.log('due', due);
        var ms = moment(due).diff(moment(new Date()));
        var d = moment.duration(ms);
        return {
          label: 'EXPIRES IN',
          value: [d.days(), d.hours(), d.minutes()],
          color: (() => {
            const date_expiry = moment(offer.currentPrice.expiration).format();
            const date_now = moment(new Date()).format();
            const time_remaining = moment.duration(moment(date_expiry).diff(date_now)).asHours();
            if (time_remaining < 8 && time_remaining > 5) return COLOR.AMBER;
            if (time_remaining < 5 && time_remaining > 2) return COLOR.ORANGE;
            if (time_remaining < 2) return COLOR.RED;
            return COLOR.BLUE;
          })()
        };
      })
    );

    this.actions$ = combineLatest(
      this.offer$,
      this.user.get().pipe(map(user => user.accountType)),
      this.checkout.get(),
      this.order.get()
    ).pipe(
      filter(([offer, user, checkout, order]) => {
        return [OfferStatus.OPEN].indexOf(offer.status) !== -1 && [OrderStatus.OPEN, OrderStatus.AUCTION_ENDED].indexOf(order.status) !== -1;
      }),
      map(([offer, accountType, items]) => {
        const selected = items.some((item: any) => item.id == offer.id);
        if (
          accountType !== AccountType.SELLER &&
          offer.status == OfferStatus.OPEN &&
          !selected
        ) {
          return [
            {
              label: "SELECT THIS OFFER",
              icon: "check",
            },
          ];
        }
        if (
          accountType !== AccountType.SELLER &&
          offer.status == OfferStatus.OPEN &&
          selected
        ) {
          return [
            {
              label: "REMOVE IN CHECKOUT",
              icon: "x",
            },
          ];
        }
        return [];
      })
    );

  }

  onActionHandler(action: any) {
    switch (action) {
      case 'SELECT THIS OFFER':
        this.iziToast.show({
          title: 'Add to checkout',
          message: `Are you sure you want to add this offer to checkout?`,
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
                  this.offer$.pipe(take(1)).subscribe(offer => {
                    this.checkout.add(offer).subscribe(() => { });;
                  });
                }
              }, toast, 'buttonName');
            }, true], // true to focus
            ['<button>Cancel</button>', (instance: any, toast: any) => {
              instance.hide({
                transitionOut: 'fadeOutUp'
              }, toast, 'buttonName');
            }]
          ],
        })
        break;
      case 'REMOVE IN CHECKOUT':
        this.iziToast.show({
          title: 'Remove in checkout',
          message: `Are you sure you want to remove this offer to checkout?`,
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
                  this.offer$.pipe(take(1)).subscribe(offer => {
                    this.checkout.remove(offer).subscribe(() => { });
                  });
                }
              }, toast, 'buttonName');
            }, true], // true to focus
            ['<button>Cancel</button>', (instance: any, toast: any) => {
              instance.hide({
                transitionOut: 'fadeOutUp'
              }, toast, 'buttonName');
            }]
          ],
        });
        break;
    }
  }



}
