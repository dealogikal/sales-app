import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { OfferStatus, OrderStatus } from 'src/app/helpers/classes/classes';
import { OffersService } from 'src/app/services/offers.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'auction-page',
  templateUrl: './auction-page.component.html',
  styleUrls: ['./auction-page.component.scss']
})
export class SellerAuctionPageComponent implements OnInit {

  $routeParams!: Subscription;
  order$!: Observable<any>;
  items$!: Observable<any>;
  item$!: Observable<any>;
  actions$!: Observable<any>;
  offers$!: Observable<any>;
  offer$!: Observable<any>;
  savings$!: Observable<any>;
  lowestOffer$!: Observable<any>;
  placeOffer$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private order: OrderService,
    private offers: OffersService,
    private user: UserService
  ) { }

  ngOnInit(): void {

    this.$routeParams = this.route.params.subscribe(params => {
      // console.log('params >>>', params);
      this.order$ = this.order.get().pipe(filter(order => order));

      if (!params.product_id) {
        this.order$.pipe(take(1)).subscribe((order) => {
          this.router.navigate([`${order.orders.products[0].id}`], { relativeTo: this.route });
        });

        return;
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

      this.offers$ = this.item$.pipe(
        filter(product => product),
        filter(product => product.hasOwnProperty('offers')),
        map(product => {
          return product.offers.map((offer: any) => {
            offer.product = product.product;
            offer.product_id = product.id;
            offer.type = product.type;
            offer.unit = product.unit;
            offer.qty = product.qty;
            return offer;
          }).sort((a: any, b: any) => {
            return a.currentPrice.subtotal - b.currentPrice.subtotal;
          });
        })
      );

     
      this.offer$ = combineLatest(
        this.order$,
        this.user.get(),
      ).pipe(
        map(([order, user]) => {
          const product = order.orders.products.find((product: any) => product.id == params.product_id);
          
          console.log('checking >>>', product, user);
          return product.offers.find((offer: any) => {
            return offer.user.id == user._id
          })

        }),
      );


      this.placeOffer$ = combineLatest(this.order$, this.offer$).pipe(
        map(([order, offer]) => {

          const item = order.orders.products.find((item: any) => item.id == params.product_id);

          if ([OrderStatus.OPEN].indexOf(item.status) == -1) return false;
          if (Object.keys(offer).indexOf("status") == -1) return true;
          if (
            [OfferStatus.CANCELLED, OfferStatus.DENIED].indexOf(
              offer.status
            ) >= 0
          ) {
            return true;
          }
          return false;
        })
      );

      

    });
  }

}
