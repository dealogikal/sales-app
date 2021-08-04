import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable, of, Subscription, zip } from 'rxjs';
import { delay, filter, map, take, tap } from 'rxjs/operators';
import { OrderStatus } from 'src/app/helpers/classes/classes';
import { NavigatorService } from 'src/app/services/navigator.service';
import { OrderService } from 'src/app/services/order.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'auction-page',
  templateUrl: './auction-page.component.html',
  styleUrls: ['./auction-page.component.scss']
})
export class AuctionPageComponent implements OnInit {

  orders$!: Observable<any>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orders: OrdersService,
    private navigator: NavigatorService
  ) { }

  ngOnInit(): void {
    this.orders$ = this.orders.get();

    this.navigator.set({
      name: '',
      routerLink: '/home/s/order/$id',
      homeLink: '/home/s/open-for-auction',
    });

  }

}
