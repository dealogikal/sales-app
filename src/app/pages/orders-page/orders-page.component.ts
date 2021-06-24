import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable, of, Subscription, zip } from 'rxjs';
import { delay, filter, map, take, tap } from 'rxjs/operators';
import { OrderStatus } from 'src/app/helpers/classes/classes';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit {

  form!: FormGroup;
  $search!: Subscription;
  $queryParams!: Subscription;

  queryParams$: BehaviorSubject<any> = new BehaviorSubject({});
  sort$: BehaviorSubject<any> = new BehaviorSubject(-1);
  loading$: BehaviorSubject<any> = new BehaviorSubject(true);

  orders$!: Observable<any>;
  tags$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orders: OrdersService,
    // private navigator: NavigatorService
  ) {
    this.form = this.fb.group({
      search: ['']
    })
  }

  ngOnInit() {

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (!Object.keys(params).length) {
        this.router.navigate([], {
          queryParams: {
            status: ['OPEN', 'FOR APPROVAL', 'WAITING', 'AUCTION ENDED', 'TO PAY', 'TO SHIP'],
            sort: -1,
            from: moment().subtract(30, "days").format('MM/DD/YYYY'),
          },
        })
      }
      this.form.get('search')!.patchValue(params.search);
    });

    this.$queryParams = combineLatest(this.queryParams$, this.route.queryParams).pipe(
      filter(([params, prev]) => JSON.stringify(params) !== JSON.stringify(prev)),
      map(([__, params]) => params)
    ).subscribe(params => {
      console.log('params >>>', params);
      this.queryParams$.next(params);
      this.sort$.next(params.sort || -1);
      let params_order: any = {};
      let status_order: any = [];

      if (params.status) {
        if (params.status.indexOf('OPEN') !== -1) status_order.push(OrderStatus.OPEN);
        if (params.status.indexOf('FOR APPROVAL') !== -1) status_order.push(OrderStatus.FOR_APPROVAL);
        if (params.status.indexOf('WAITING') !== -1) status_order.push(OrderStatus.WAITING);
        if (params.status.indexOf('AUCTION ENDED') !== -1) status_order.push(OrderStatus.AUCTION_ENDED);
        if (params.status.indexOf('REJECTED') !== -1) status_order.push(OrderStatus.DENIED);
        if (params.status.indexOf('OVERDUE') !== -1) status_order.push(OrderStatus.OVERDUE);
        if (params.status.indexOf('EXPIRED') !== -1) status_order.push(OrderStatus.EXPIRED, OrderStatus.CLOSED_EXPIRED_AUCTION, OrderStatus.CLOSED_EXPIRED_OFFER);
        if (params.status.indexOf('TO SHIP') !== -1) status_order.push(OrderStatus.FOR_DELIVERY, OrderStatus.IN_TRANSIT, OrderStatus.PRODUCT_DELIVERED, OrderStatus.FOR_REVIEW);
        if (params.status.indexOf('TO PAY') !== -1) status_order.push(OrderStatus.FOR_BUYER_PAYMENT, OrderStatus.BUYER_PAYMENT_VERIFICATION, OrderStatus.SELLER_PAYMENT, OrderStatus.FOR_REVIEW);
        if (params.status.indexOf('CLOSED') !== -1) status_order.push(OrderStatus.CLOSED_DEAL);

        params_order.status = status_order;
      }

      const dateCreated: any = {}
      if (params.from) {
        dateCreated['$gte'] = moment(params.from).toDate();
      }

      if (params.to) {
        dateCreated['$lt'] = moment(params.to).add(1, 'days').toDate();
      }

      if (Object.keys(dateCreated).length) {
        params_order.dateCreated = dateCreated;
      }

      // this.navigator.set({
      //   name: '',
      //   routerLink: '/home/b/order/$id',
      //   homeLink: '/home/b/my-orders',
      //   queryParams: params
      // });

      this.loading$.next(true);


      console.log('params_order', params_order);

      this.orders$ = this.orders.get().pipe(
        map((orders) => {
          console.log(orders);
          return orders.filter((order: any) => {
            const status = status_order.indexOf(order.status) !== -1;
            const date_gte = moment(order.dateCreated).isSameOrAfter(moment(params.from));
            const date_lte = moment(order.dateCreated).isSameOrBefore(moment(params.to));
            const id = order._id == params.search;
            const batchId = order.batchId == parseInt(params.search);
            const product_search = order.orders.products.some((product: any) => {
              console.log('product_search', product.product);
              const name = product.product.toLowerCase().indexOf(params.search ? params.search.toLowerCase() : '') !== -1;
              const type = product.type.toLowerCase().indexOf(params.search ? params.search.toLowerCase() : '') !== -1;
              const region = product.shipping.region.toLowerCase().indexOf(params.search ? params.search.toLowerCase() : '') !== -1;
              const province = product.shipping.province.toLowerCase().indexOf(params.search ? params.search.toLowerCase() : '') !== -1;
              const location = product.shipping.location.toLowerCase().indexOf(params.search ? params.search.toLowerCase() : '') !== -1;

              return name || type || region || province || location;
            });

            const search = params.search ? (product_search || batchId || id) : true;
            console.log('order >>>', order);

            console.log('status >>>', status, params.status, order.status);
            console.log('date_gte >>>', date_gte);
            console.log('date_lte >>>', date_lte);
            console.log('search >>>', search);


            return status && date_gte && date_lte && search;
          });
        }),
        map(orders => {
          return orders.sort((a: any, b: any) => {
            if (params.sort == 1) {
              return a.dateCreated - b.dateCreated;
            } else {
              return b.dateCreated - a.dateCreated;
            }
          })
        }),
      );

      this.tags$ = this.queryParams$.pipe(
        map(params => {
          let holder = [];
          if (params.from && params.to) {
            holder.push(`${params.from} - ${params.to}`);
          }
          if (params.status.length) {
            if (typeof params.status == 'string') {
              holder.push(params.status);
            } else {
              params.status.forEach((status: any) => {
                holder.push(status);
              });
            }
          }
          return holder;
        })
      )

    });



    this.$search = this.form.get('search')!.valueChanges.subscribe((value: any) => {
      console.log('search', value);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: value },
        queryParamsHandling: 'merge'
      })
    });

  }

  ngOnDestroy() {
    if (this.$queryParams) {
      this.$queryParams.unsubscribe();

    }
    if (this.$search) {
      this.$search.unsubscribe();
    }
  }

  setSort(sort: number) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { sort: sort }, queryParamsHandling: 'merge' });
  }

}
