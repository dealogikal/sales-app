import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
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

  documents$: BehaviorSubject<any> = new BehaviorSubject([
    {
      name: 'Purchase Order',
      url: 'https://res.cloudinary.com/dealogikal/raw/upload/v1624522202/purchase-orders/b_3YPaT4Rahadcm4oY5_KPWGMT5B2602YP0_6644.640941549086.pdf'
    },
    {
      name: 'Sales Invoice',
      url: 'https://res.cloudinary.com/dealogikal/raw/upload/v1624522214/sales-invoice/bInvoice_3YPaT4Rahadcm4oY5_KPWGMT5B2602YP0_24904.577984203017.pdf'
    },
    {
      name: 'Official Receipt',
      url: 'https://res.cloudinary.com/dealogikal/raw/upload/v1624522219/official-receipt/bReceipt_3YPaT4Rahadcm4oY5_KPWGMT5B2602YP0_56412.804881040895.pdf'
    },
    {
      name: 'Collection Receipt',
      url: 'https://res.cloudinary.com/dealogikal/raw/upload/v1624522222/collection-receipt/bCReceipt_3YPaT4Rahadcm4oY5_KPWGMT5B2602YP0_825.4458279665569.pdf'
    }
  ]);

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

    this.msg$ = this.order.getMessage(Pages.PAYMENT);

    this.breakdowns$ = this.payment.breakdown();

    this.total$ = this.payment.total();




  }

}
