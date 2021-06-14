import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { OrderStatus } from 'src/app/helpers/classes/classes';
import { OffersService } from 'src/app/services/offers.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'auction-page',
  templateUrl: './auction-page.component.html',
  styleUrls: ['./auction-page.component.scss']
})
export class BuyerAuctionPageComponent implements OnInit {

  $routeParams!: Subscription;
  order$!: Observable<any>;
  items$!: Observable<any>;
  item$!: Observable<any>;
  actions$!: Observable<any>;
  offers$!: Observable<any>;
  savings$!: Observable<any>;
  lowestOffer$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private order: OrderService,
    private offers: OffersService,
  ) { }

  ngOnInit(): void {

    this.$routeParams = this.route.params.subscribe(params => {
      console.log('params >>>', params);
      this.order$ = this.order.get().pipe(filter(order => order));

      if (!params.product_id) {
        this.order$.pipe(take(1)).subscribe((order) => {
          this.router.navigate([`${order.orders.products[0].id}`], { relativeTo: this.route });
        });
      }

      this.items$ = this.order$.pipe(
        map((order) => order.orders.products)
      );

      this.item$ = combineLatest(this.items$).pipe(
        map(([items]) => {
          let p = JSON.parse(JSON.stringify(items)).find((item: any) => item.id == params.product_id);
          if (!p) return;
          p.participants = p.participants.reduce((acc: any, curr: any) => {
            if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
              acc.push({
                label: curr.groupName
              });
            }
            return acc;
          }, []);
          return p;
        })
      );

      this.actions$ = combineLatest(
        this.item$,
      ).pipe(
        map(([item]) => {
          if ([
            OrderStatus.FOR_APPROVAL,
            OrderStatus.WAITING,
            OrderStatus.OPEN,
            OrderStatus.DENIED,
            OrderStatus.EXPIRED,
            OrderStatus.OVERDUE,
          ].indexOf(item.status) !== -1) {
            return [
              {
                label: 'EDIT PRODUCT',
                icon: 'edit',
              },
              {
                label: 'CANCEL PRODUCT',
                icon: 'x',
              }
            ];
          }
          return undefined;
        })
      );

      this.offers$ = this.item$.pipe(map(product => {
        if (!product.offers) return [];
        return product.offers.sort((a: any, b: any) => {
          return b.currentPrice.subtotal - b.currentPrice.subtotal;
        });
      }));





    });
  }

}
