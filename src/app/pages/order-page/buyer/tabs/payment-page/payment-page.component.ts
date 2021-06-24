import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { combineLatest, Observable } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { OrderStatus, Pages, PaymentMethods } from 'src/app/helpers/classes/classes';
import { ConfigService } from 'src/app/services/config.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class BuyerPaymentPageComponent implements OnInit {
  order$!: Observable<any>;
  breakdowns$!: Observable<any>;
  items$!: Observable<any>;
  total$!: Observable<any>;
  msg$!: Observable<any>;

  OrderStatus: any = OrderStatus;

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private order: OrderService,
    private payment: PaymentService,
    private fb: FormBuilder,
    private config: ConfigService,
    private iziToast: NgxIzitoastService,
  ) {
    
  }

  ngOnInit(): void {

    this.order$ = this.order.get();

    this.items$ = this.order.get().pipe(
      map(order => {
        console.log('items >>>', order);
        return order.orders.products;
      })
    );

    this.msg$ = this.order.getMessage(Pages.BREAKDOWN);

    this.breakdowns$ = this.payment.breakdown();

    this.total$ = this.payment.total();

    


  }

}
