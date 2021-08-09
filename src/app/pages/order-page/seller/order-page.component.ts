import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, Observable, Subscription, timer } from 'rxjs';
import { debounceTime, filter, map, skipWhile, take } from 'rxjs/operators';
import { AccountType, COLOR, OrderStatus, StepStatus, TaxRateType } from 'src/app/helpers/classes/classes';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class SellerOrderPageComponent implements OnInit {

  @HostBinding('class.__open-drawer') openDrawer = false;
  
  $routeParams!: Subscription;
  $progress!: Subscription;

  order$!: Observable<any>;
  progress$!: Observable<any>;
  actions$!: Observable<any>;
  duration$!: Observable<any>;
  checkoutItems$!: Observable<any>;
  navigator$!: Observable<any>;

  StepStatus: any = StepStatus;
  TaxRateType: any = TaxRateType;
  AccountType: any = AccountType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orders: OrdersService,
    private order: OrderService,
    private checkout: CheckoutService,
    private navigator: NavigatorService,
  ) { }

  ngOnInit(): void {
    this.$routeParams = this.route.params.pipe(
      debounceTime(250)
    ).subscribe(params => {

      this.navigator.setCurrentId(params._id);
      this.navigator$ = this.navigator.get();


      this.order$ = this.orders.find(params._id);

      this.order$.pipe(take(1)).subscribe(order => {
        console.log('settt >>>', order);
        this.order.set(order);
      });

      this.progress$ = combineLatest(this.order$).pipe(
        map(([order]) => {
          const steps: any = this.orders.generateSteps(
            order,
            AccountType.SELLER
          );
          const completed = steps.reduce((acc: any, curr: any) => {
            curr.status == StepStatus.COMPLETE && acc++;

            acc = acc > steps.length - 1 ? steps.length - 1 : acc;

            return acc;
          }, 0);
          const res = {
            steps: steps,
            rate: (completed / (steps.length - 1)) * 100,
          };
          return res;
        })
      );

      this.$progress = this.$progress = this.progress$.pipe(filter((progress) => {
        return !progress.steps.every((p: any) => p.status == 'incomplete');
      }), take(1)).subscribe((progress) => {
        const step = progress.steps.find((step: any) => step.status == StepStatus.ONGOING)
          ? progress.steps.find((step: any) => step.status == StepStatus.ONGOING).label : 'Closed Deal';

        let url = '';

        switch (step) {
          case 'Auction':
            url = `auction`;
            break;
          case 'Breakdown':
            url = `breakdown`;
            break;
          case 'Payment':
            url = `payment`;
            break;
          case 'Shipping':
            url = `shipping`;
            break;
          default:
            url = `closed`;
            break;
        }

        url = this.router.url.indexOf(url) !== -1 ? this.router.url : url;

        this.router.navigate([url], { relativeTo: this.route });

      });

      this.duration$ = combineLatest(
        this.order$,
        timer(0, 1000),
      ).pipe(
        filter(([order, __]) => {
          return [OrderStatus.OPEN, OrderStatus.FOR_APPROVAL, OrderStatus.WAITING].indexOf(order.status) !== -1;
        }),
        map(([order, __]) => {
          // console.log("duration$", order);
          const due = (
            (order.status == OrderStatus.OPEN)
          ) ? moment(order.startDate).add(order.duration, 'hours').format() : moment(order.startDate).format();
          // console.log('due', due);
          var ms = moment(due).diff(moment(new Date()));
          var d = moment.duration(ms);
          return {
            label: (
              (order.status == OrderStatus.OPEN)
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

      this.actions$ = this.order$.pipe(
        map((order: any) => {
          if ([
            OrderStatus.FOR_APPROVAL,
            OrderStatus.WAITING,
            OrderStatus.OPEN,
            OrderStatus.DENIED,
            OrderStatus.EXPIRED,
            OrderStatus.OVERDUE,
          ].indexOf(order.status) !== -1) {
            return [
              {
                label: "EDIT ORDER",
                icon: "edit",
              },
              {
                label: "CHANGE PAYMENT METHOD",
                icon: "credit-card",
              },
              {
                label: "CANCEL ORDER",
                icon: "x",
              },
            ];
          }
          return undefined;
        })
      );

      this.checkoutItems$ = this.checkout.get();

      this.checkout.get().subscribe(items => {
        if (items.length) this.openDrawer = true;
        else this.openDrawer = false;
      });

      
    })
  }

}
