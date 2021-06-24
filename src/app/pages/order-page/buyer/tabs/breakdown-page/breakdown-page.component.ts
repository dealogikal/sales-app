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
  selector: 'breakdown-page',
  templateUrl: './breakdown-page.component.html',
  styleUrls: ['./breakdown-page.component.scss']
})
export class BuyerBreakdownPageComponent implements OnInit {
  order$!: Observable<any>;
  breakdowns$!: Observable<any>;
  items$!: Observable<any>;
  total$!: Observable<any>;
  config$!: Observable<any>;
  methods$!: Observable<any>;
  options$!: Observable<any>;
  channels$!: Observable<any>;
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
    this.form = this.fb.group({
      method: ['Cash on delivery', Validators.required],
      option: ['Bank Transfer', Validators.required],
      channel: ['Upload deposit slip', Validators.required],
    })
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

    this.config$ = this.config.getPaymentOptions();

    this.methods$ = this.config$.pipe(
      map(methods => {
        console.log('methods', methods);
        return methods.filter((m: any) => !m.disabled).map((m: any) => m.method);
      })
    );

    this.options$ = combineLatest(
      this.form.get('method')!.valueChanges,
      this.config$
    ).pipe(
      map(([method, config]) => {
        return config.find((m: any) => m.method == method).options.map((o: any) => o.type);
      })
    );

    this.channels$ = combineLatest(
      this.form.get('method')!.valueChanges,
      this.form.get('option')!.valueChanges,
      this.config$
    ).pipe(
      map(([method, option, config]) => {
        const options = config.find((m: any) => m.method == method).options;
        const selected_option = options.find((o: any) => o.type == option).channel;
        console.log(options, option, selected_option);
        return selected_option;
      })
    );

    this.order.get().pipe(
      filter(order => order),
      take(1),
      delay(100),
      tap((order => {
        console.log('payment >>>', order);
        this.form.patchValue({
          method: order.payment.method
        })
      })),
      delay(100),
      tap((order => {
        console.log('payment >>>', order);
        this.form.patchValue({
          option: order.payment.option
        })
      })),
      delay(100),
      tap((order => {
        console.log('payment >>>', order);
        this.form.patchValue({
          channel: order.payment.channel
        })
      }))
    ).subscribe(order => {

    });



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
              this.order.get().pipe(
                take(1),
                map(order => {
                  return order.orders.products;
                }),
                switchMap(products => this.payment.next(products))
              ).subscribe((order) => {
                console.log('onProceed >>>', order);
                switch (order.payment.method) {
                  case PaymentMethods.CBD:
                    this.router.navigate(['../payment'], { relativeTo: this.route });
                    break;
                  default:
                    this.router.navigate(['../shipping'], { relativeTo: this.route });
                    break;
                }

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
