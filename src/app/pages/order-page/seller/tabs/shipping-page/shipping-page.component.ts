import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { Subscription, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { OrderStatus, Pages, PaymentMethods } from 'src/app/helpers/classes/classes';
import { ConfigService } from 'src/app/services/config.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PaymentService } from 'src/app/services/payment.service';
import { WorkflowService } from 'src/app/services/workflow.service';

@Component({
  selector: 'shipping-page',
  templateUrl: './shipping-page.component.html',
  styleUrls: ['./shipping-page.component.scss']
})
export class SellerShippingPageComponent implements OnInit {
  $routeParams!: Subscription;

  order$!: Observable<any>;

  items$!: Observable<any>;

  progress$!: Observable<any>;

  percentage$!: Observable<any>;

  nextStatus$!: Observable<any>;

  OrderStatus = OrderStatus;

  accountType$: Observable<any> = new Observable();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private order: OrderService,
    private orders: OrdersService,
    private payment: PaymentService,
    private config: ConfigService,
    private iziToast: NgxIzitoastService,
    private workflow: WorkflowService
  ) { }

  ngOnInit(): void {

    this.order$ = this.order.get();

    this.items$ = this.order$.pipe(
      map((order) => {
        return order.orders.products;
      })
    );

    this.progress$ = this.items$.pipe(
      map((items) => {
        return items.reduce((holder: any, item: any) => {
          // console.log("item progress", item);

          holder[item.id] = item.shipping.schedules.reduce((schedules: any, schedule: any) => {
            let progress = [
              {
                label: "For Delivery",
                total: 1,
                progress: 0,
                position: "start",
              },
              {
                label: "In Transit",
                total: 1,
                progress: 0,
                position: "center",
              },
              {
                label: "Product Delivered",
                total: 1,
                progress: 0,
                position: "end",
              },
            ];

            if (
              schedule.status == OrderStatus.PRODUCT_DELIVERED ||
              [
                OrderStatus.PRODUCT_DELIVERED,
                OrderStatus.IN_TRANSIT,
                OrderStatus.FOR_DELIVERY,
              ].indexOf(schedule.status) == -1
            ) {
              progress[0].progress += 1;
              progress[1].progress += 1;
              progress[2].progress += 1;
            }

            if (schedule.status == OrderStatus.IN_TRANSIT) {
              progress[0].progress += 1;
              progress[1].progress += 1;
              progress[2].progress += 0;
            }

            if (schedule.status == OrderStatus.FOR_DELIVERY) {
              progress[0].progress += 1;
              progress[1].progress += 0;
              progress[2].progress += 0;
            }

            schedules[schedule.id] = progress;

            // console.log("progress", holder);
            return schedules;
          }, {});

          return holder

        }, {});
      })
    );

    this.percentage$ = this.progress$.pipe(
      map((progress) => {
        const holder: any = {};
        Object.keys(progress).forEach((key) => {
          const item = progress[key];
          holder[key] = {};

          Object.keys(progress[key]).forEach((sched_key) => {
            // console.log("item", item);

            const itemProgress = item[sched_key].reduce((acc: any, curr: any) => {
              acc += curr.progress;
              return acc;
            }, 0);
            // console.log("itemProgress", itemProgress);
            const itemProgressTotal = item[sched_key].reduce((acc: any, curr: any) => {
              acc += curr.total;
              return acc;
            }, 0);
            // console.log("itemProgressTotal", itemProgressTotal);
            const percentage = ((itemProgress - 1) / (itemProgressTotal - 1)) * 100;
            holder[key][sched_key] = `${percentage}%`;
          })
        });

        // console.log("percentage", holder);
        return holder;
      })
    );

  }


  onNext(product: any, schedule: any) {
    console.log('onNext', product, schedule);

    this.iziToast.show({
      title: 'Confirm',
      message: `Are you sure you want to confirm?`,
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
              this.order.get().pipe(
                take(1),
                switchMap(order => this.workflow.next(order, order.orders.products)),
                switchMap(order => this.orders.save(order))
              ).subscribe((order) => {
                console.log('onProceed >>>', order);

                this.order.get().pipe(
                  take(1),
                  switchMap(order => this.workflow.shippingNext(order, product, schedule)),
                  switchMap(order => this.orders.save(order))
                ).subscribe(order => {
                  console.log('order >>>', order)
                })

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

}
