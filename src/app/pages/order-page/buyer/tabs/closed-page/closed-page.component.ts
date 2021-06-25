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
  selector: 'closed-page',
  templateUrl: './closed-page.component.html',
  styleUrls: ['./closed-page.component.scss']
})
export class BuyerClosedPageComponent implements OnInit {

  order$!: Observable<any>;

  items$!: Observable<any>;

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
  }

}
