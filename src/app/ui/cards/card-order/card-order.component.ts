import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject, Observable, combineLatest, timer, Subscription } from 'rxjs';
import { debounceTime, map, filter, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountType, COLOR, OfferStatus, OrderStatus, PaymentMethods } from 'src/app/helpers/classes/classes';
import * as moment from 'moment';



@Component({
  selector: 'card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent implements OnInit {

  data$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  mode$: BehaviorSubject<any> = new BehaviorSubject(AccountType.BUYER);
  order$!: Observable<any>;
  date$!: Observable<any>;
  status$!: Observable<any>;
  duration$!: Observable<any>;

  @Input()
  set mode(value: AccountType) {
    this.mode$.next(value);
  }

  @Input()
  set data(value: any) {
    // console.log('value >>', value)
    this.data$.next(value);
  }

  @Output() onEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.date$ = combineLatest(
      this.data$,
      timer(0, 60000),
      (data: any) => data
    ).pipe(
      map((data: any) => {
        return moment(data.dateCreated).fromNow();
      })
    );

    this.order$ = combineLatest(this.data$, this.mode$, this.user.get()).pipe(map(([data, mode, user]) => {
      if (mode == AccountType.SELLER && [
        OfferStatus.OPEN,
        OfferStatus.FOR_VALIDATION,
        OfferStatus.PENDING_VERIFICATION,
        OfferStatus.CANCELLED,
        OfferStatus.DENIED,
        OfferStatus.CLOSED,
        OfferStatus.CLOSED_EXPIRED_AUCTION,
        OfferStatus.CLOSED_EXPIRED_OFFER,
      ].indexOf(data.status) == -1) {
        data.orders.products = data.orders.products.filter((product: any) => product.user.id == user._id)
      }
      return data;
    }));

    this.status$ = combineLatest(this.data$, this.mode$).pipe(
      map(([order, mode]) => {
        if (mode == AccountType.SELLER) {
          const seller_cod_payment = [
            OrderStatus.FOR_REVIEW,
            OrderStatus.SELLER_PAYMENT,
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

          if ([OfferStatus.OPEN].indexOf(order.status) !== -1) return 'OPEN'
          if ([OfferStatus.PENDING_VERIFICATION].indexOf(order.status) !== -1) return 'FOR APPROVAL'
          if ([OfferStatus.FOR_VALIDATION].indexOf(order.status) !== -1) return 'FOR VALIDATION'
          if ([OfferStatus.DENIED].indexOf(order.status) !== -1) return 'REJECTED'
          if ([OfferStatus.CANCELLED].indexOf(order.status) !== -1) return 'CANCELLED'
          if ([OfferStatus.CLOSED].indexOf(order.status) !== -1) return 'LOST'
          if ([OfferStatus.CLOSED_EXPIRED_AUCTION, OfferStatus.CLOSED_EXPIRED_OFFER].indexOf(order.status) !== -1) return 'EXPIRED'
          if (order.payment.method == PaymentMethods.CBD && seller_cbd_payment.indexOf(order.status) !== -1) return 'PAYMENT';
          if (order.payment.method == PaymentMethods.COD && seller_cod_payment.indexOf(order.status) !== -1) return 'PAYMENT';
          if (order.payment.method == PaymentMethods.CBD && seller_cbd_shipping.indexOf(order.status) !== -1) return 'SHIPPING';
          if (order.payment.method == PaymentMethods.COD && seller_cod_shipping.indexOf(order.status) !== -1) return 'SHIPPING';
          if ([OrderStatus.CLOSED_DEAL].indexOf(order.status) !== -1) return 'CLOSED';
        }

        if ([OrderStatus.OPEN].indexOf(order.status) !== -1) return 'OPEN'
        if ([OrderStatus.FOR_APPROVAL].indexOf(order.status) !== -1) return 'FOR APPROVAL'
        if ([OrderStatus.WAITING].indexOf(order.status) !== -1) return 'WAITING'
        if ([OrderStatus.AUCTION_ENDED].indexOf(order.status) !== -1) return 'AUCTION ENDED'
        if ([OrderStatus.DENIED].indexOf(order.status) !== -1) return 'REJECTED'
        if ([OrderStatus.OVERDUE].indexOf(order.status) !== -1) return 'OVERDUE'
        if ([OrderStatus.EXPIRED, OrderStatus.CLOSED_EXPIRED_AUCTION, OrderStatus.CLOSED_EXPIRED_OFFER].indexOf(order.status) !== -1) return 'EXPIRED'
        if (order.payment.method == PaymentMethods.CBD && order.status == OrderStatus.FOR_REVIEW) return 'TO PAY';
        if (order.payment.method == PaymentMethods.COD && order.status == OrderStatus.FOR_REVIEW) return 'TO SHIP';
        if ([OrderStatus.FOR_DELIVERY, OrderStatus.IN_TRANSIT, OrderStatus.PRODUCT_DELIVERED].indexOf(order.status) !== -1) return 'TO SHIP';
        if ([OrderStatus.FOR_BUYER_PAYMENT, OrderStatus.BUYER_PAYMENT_VERIFICATION, OrderStatus.SELLER_PAYMENT].indexOf(order.status) !== -1) return 'TO PAY'
        if ([OrderStatus.CLOSED_DEAL].indexOf(order.status) !== -1) return 'CLOSED';
        return '';
      })
    );


    this.duration$ = combineLatest(
      this.data$,
      this.mode$,
      timer(0, 60000),
    ).pipe(
      filter(([order, mode, __]) => {
        if (mode == AccountType.SELLER) {
          return [OfferStatus.OPEN, OfferStatus.FOR_VALIDATION, OfferStatus.PENDING_VERIFICATION].indexOf(order.status) !== -1;
        } else {
          return [OrderStatus.OPEN, OrderStatus.FOR_APPROVAL, OrderStatus.WAITING].indexOf(order.status) !== -1;
        }
      }),
      map(([order, mode, __]) => {
        const due = (
          (order.status == OrderStatus.OPEN && mode !== AccountType.SELLER) ||
          (mode == AccountType.SELLER && order.status == OfferStatus.OPEN)
        ) ? moment(order.startDate).add(order.duration, 'hours').format() : moment(order.startDate).format();
        console.log('due', due);
        var ms = moment(due).diff(moment(new Date()));
        var d = moment.duration(ms);
        return {
          label: (
            (order.status == OrderStatus.OPEN && mode !== AccountType.SELLER) ||
            (mode == AccountType.SELLER && order.status == OfferStatus.OPEN)
          ) ? 'ENDS IN' : 'STARTS IN',
          value: [d.days(), d.hours(), d.minutes()],
          color: (() => {
            const date_expiry = moment(order.startDate).add(order.duration, 'hours').format();
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



  }



  onView() {
    combineLatest(
      this.data$,
      this.mode$,
    ).pipe(take(1)).subscribe(([order, mode]) => {
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

      const seller_auction = [
        OfferStatus.OPEN,
        OfferStatus.FOR_VALIDATION,
        OfferStatus.PENDING_VERIFICATION,
        OfferStatus.CANCELLED,
        OfferStatus.DENIED,
        OfferStatus.CLOSED,
        OfferStatus.CLOSED_EXPIRED_AUCTION,
        OfferStatus.CLOSED_EXPIRED_OFFER,
      ];

      const seller_cod_payment = [
        OrderStatus.FOR_REVIEW,
        OrderStatus.SELLER_PAYMENT,
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
      let step_order = [];
      let routes = [];
      console.log('mode', mode);
      if (mode == AccountType.SELLER) {
        step_order = [
          seller_auction,
          order.payment.method == PaymentMethods.CBD
            ? seller_cbd_payment
            : seller_cod_payment,
          order.payment.method == PaymentMethods.CBD
            ? seller_cbd_shipping
            : seller_cod_shipping,
          closed,
        ];
        routes = [
          'auction',
          'payment',
          'shipping',
          'closed'
        ];
      } else {
        step_order = [
          auction,
          order.payment.method == PaymentMethods.COD ? cod_breakdown : breakdown,
          order.payment.method == PaymentMethods.COD ? shipping : payment,
          order.payment.method == PaymentMethods.COD ? cod_payment : shipping,
          closed
        ];
        routes = [
          'auction',
          'breakdown',
          order.payment.method == PaymentMethods.COD ? 'shipping' : 'payment',
          order.payment.method == PaymentMethods.COD ? 'payment' : 'shipping',
          'closed'
        ];
      }


      const step_index = step_order.findIndex((step: any) =>
        step.includes(order.status)
      );

      const route = routes[step_index];

      console.log('route', route);

      this.router.navigate(['../order', order.bidId ? order.bidId : order._id, route], { relativeTo: this.route });
    })
  }

}
