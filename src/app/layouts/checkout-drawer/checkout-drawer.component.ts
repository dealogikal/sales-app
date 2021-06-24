import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { OrderStatus, TaxRateType } from 'src/app/helpers/classes/classes';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'checkout-drawer',
  templateUrl: './checkout-drawer.component.html',
  styleUrls: ['./checkout-drawer.component.scss']
})
export class CheckoutDrawerComponent implements OnInit {

  order$!: Observable<any>;
  checkoutItems$!: Observable<any>;
  checkoutBreakdowns$!: Observable<any>;
  total$!: Observable<any>;
  validCount$!: Observable<any>;

  constructor(
    private checkout: CheckoutService,
    private order: OrderService,
    private orders: OrdersService,
    private iziToast: NgxIzitoastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.order$ = this.order.get();
    this.checkoutItems$ = this.checkout.get();
    this.checkoutBreakdowns$ = this.checkout.breakdown();
    this.total$ = this.checkout.total();

    this.validCount$ = this.order.get().pipe(map(order => {
      const valid = order.orders.products.filter((product: any) => [OrderStatus.OPEN, OrderStatus.AUCTION_ENDED].indexOf(product.status) !== -1);
      return valid.length;
    }));

  }

  onProceed() {

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
                this.order.get(),
                this.checkout.get(),
              ).pipe(
                take(1),
                map(([order, items]) => {
                  order.orders.products = order.orders.products.map((product: any) => {
                    product.selectedPrice = items.find((item: any) => item.product_id == product.id);;
                    product.status = OrderStatus.FOR_REVIEW;
                    return product;
                  });
                  order.status = OrderStatus.FOR_REVIEW;
                  order.lastUpdated = new Date();
                  return order;
                }),
                switchMap(order => this.orders.save(order))
              ).subscribe(e => {
                console.log('proceed', e);
                this.checkout.clear();
                this.router.navigate(['./breakdown'], {relativeTo: this.route});
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
