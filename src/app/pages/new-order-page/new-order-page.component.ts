import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { delay, map, skipWhile, take, tap } from 'rxjs/operators';
import { PaymentMethods } from 'src/app/helpers/classes/classes';
import { ConfigService } from 'src/app/services/config.service';
import { NewOrderService } from 'src/app/services/new-order.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'new-order-page',
  templateUrl: './new-order-page.component.html',
  styleUrls: ['./new-order-page.component.scss']
})
export class NewOrderPageComponent implements OnInit {

  payment_methods$: Observable<any> = new Observable();
  payment_options$: Observable<any> = new Observable();
  payment_days$: Observable<any> = new Observable();
  payment_channels$: Observable<any> = new Observable();
  showAddPaymentOptions$: Observable<any> = new Observable();
  user$: Observable<any> = new Observable();
  config$: Observable<any> = new Observable();
  order$: Observable<any> = new Observable();
  products$: Observable<any> = new Observable();
  initDone$: BehaviorSubject<any> = new BehaviorSubject(false);

  $form: Subscription = new Subscription;
  $formInit: Subscription = new Subscription;
  $update: Subscription = new Subscription;
  $commodity: Subscription = new Subscription;
  $routeParams: Subscription = new Subscription;

  paymentGroup: FormGroup;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private user: UserService,
    private template: TemplatesService,
    private order: NewOrderService,
    private iziToast: NgxIzitoastService,
  ) {
    this.paymentGroup = this.fb.group({
      method: ['', Validators.required],
      days: ['', Validators.nullValidator],
      option: ['', Validators.required],
      channel: ['', Validators.required],
    });

    this.form = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: ['', Validators.required],
      shippingMethod: ['', Validators.required],
      isSameLocation: [false, Validators.required],
      payment: this.paymentGroup
    });
  }

  ngOnInit(): void {

    this.order$ = this.order.get();

    this.user$ = this.user.get();

    this.config$ = combineLatest(
      this.user$,
      this.config.getCommodities(),
      this.config.getShippingMethod(),
      this.config.getPaymentOptions(),
      this.config.getPaymentOptionsReqs()
    ).pipe(
      map(([user, commodities, shipping_methods, payment_options, payment_options_reqs]) => {
        const por = payment_options_reqs.map((paymentOption: any) => {
          paymentOption.enabled = user.settings.paymentOptions.find((p: any) => p.name == paymentOption.name).enabled;
          return paymentOption;
        });

        const res = {
          commodities: commodities.map((commodity: any) => commodity.name),
          shipping_methods: shipping_methods,
          payment_options: payment_options.reduce((acc: any[], opt: any) => {
            const p = por.find((p: any) => p.name == opt.method);

            const isEnabled = !p ? false : p.enabled;
            if (opt.method == PaymentMethods.COD) {
              opt.disabled = !isEnabled;
            }
            if (!opt.disabled) {
              acc.push(opt);
            }
            return acc;
          }, []),
        }

        return res;
      })
    );

    this.config$.subscribe(e => console.log('config >>>', e));

    this.$routeParams = this.route.params.subscribe(params => {
      console.log('template_id >>>', params.template_id);
      this.initDone$.next(false);
      this.template.find(params.template_id).pipe(
        tap(template => {
          if (!template) this.order.clear();
        }),
        skipWhile((template) => !template),
        take(1),
      ).subscribe(template => {
        console.log('template >>>', template);
        template.products = template.products.map((product: any) => {
          product.id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
          return product;
        });
        this.order.set(template);
      });

      if (this.$formInit) {
        this.$formInit.unsubscribe();
      }

      if (this.$form) {
        this.$form.unsubscribe();
      }

      this.$formInit = combineLatest(this.config$, this.order.get()).pipe(
        skipWhile(([__, order]) => order._id !== params.template_id),
        take(1),
        delay(100),
        tap(([__, order]) => {
          this.form.patchValue({
            startDate: order.startDate,
            startTime: order.startTime,
            duration: order.duration,
            commodity: order.commodity,
            shippingMethod: order.shippingMethod,
            isSameLocation: order.isSameLocation || false,
          });
        }),
        delay(100),
        tap(([__, order]) => {
          this.form.get('payment')!.patchValue({
            method: order.payment.method
          });
        }),

        delay(100),
        tap(([__, order]) => {
          this.form.get('payment')!.patchValue({
            option: order.payment.option
          });
        }),
        delay(100),
        tap(([__, order]) => {
          this.form.get('payment')!.patchValue({
            channel: order.payment.channel
          });
        })
      ).subscribe(order => {
        // console.log('formInit >>>', order);
        this.initDone$.next(true);
      });

      this.$form = combineLatest(
        this.form!.valueChanges,
        this.initDone$
      ).pipe(
        skipWhile(([__, done]) => !done)
      ).subscribe(([order, __]) => {
        this.order.set(order);
      });

    });

    this.showAddPaymentOptions$ = combineLatest(
      this.user$,
      this.config.getPaymentOptionsReqs()
    ).pipe(
      map(([user, paymentOptionsReq]) => {
        const por = paymentOptionsReq.map((paymentOption: any) => {
          paymentOption.enabled = user.settings.paymentOptions.find((p: any) => p.name == paymentOption.name).enabled;
          return paymentOption;
        });
        return por.some((paymentOption: any) => !paymentOption.enabled);
      })
    );

    this.payment_methods$ = this.config$.pipe(
      map(config => {
        return config.payment_options.map((po: any) => po.method);
      })
    );

    this.payment_options$ = combineLatest(
      this.config$,
      this.form.get('payment.method')!.valueChanges,
    ).pipe(
      map(([config, payment_method]) => {
        if (!payment_method) return [];
        return config.payment_options.find((po: any) => po.method == payment_method).options.map((option: any) => option.type);
      })
    );

    this.payment_days$ = combineLatest(
      this.config$,
      this.form.get('payment.method')!.valueChanges,
    ).pipe(
      map(([config, payment_method]) => {
        if (!payment_method) return [];


        if (payment_method == PaymentMethods.TERMS) {
          this.form.get('payment.days')!.setValidators([Validators.required]);
        } else {
          this.form.get('payment.days')!.setValidators([Validators.nullValidator]);
        }

        this.form.get('payment.days')!.updateValueAndValidity();

        let days = config.payment_options.find((po: any) => po.method == payment_method).options.map((option: any) => option.days);

        return days[0];
      })
    );

    this.payment_channels$ = combineLatest(
      this.config$,
      this.form.get('payment.method')!.valueChanges,
      this.form.get('payment.option')!.valueChanges,
    ).pipe(
      map(([config, payment_method, payment_option]) => {
        if (!payment_method || !payment_option) return [];
        return config.payment_options.find((po: any) => po.method == payment_method).options.find((option: any) => option.type == payment_option).channel;
      })
    );

    this.products$ = this.order.get().pipe(
      map((order) => {
        const _order = JSON.parse(JSON.stringify(order));
        return _order.products.map((product: any) => {
          product.participants = product.participants.reduce((acc: any, curr: any) => {
            if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
              acc.push({
                label: curr.groupName,
                selected: curr.selected
              });
            }
            return acc;
          }, []);
          return product;
        })
      })
    );

  }

  filterPaymentMethod(paymentMethods: string[], commodity: string) {
    return this.order.filterPaymentMethod(paymentMethods, commodity)
  }

  onSubmit() {

  }




  onSave() {
    this.route.params.pipe(take(1)).subscribe(params => {
      if (!params.template_id) {
        this.router.navigate(['save'], { relativeTo: this.route });
        return;
      }
      this.iziToast.show({
        title: 'Save Template',
        message: `Are you sure you want to update changes?`,
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
                // $(".loaderModal").modal({
                //     backdrop: "static",
                //     keyboard: false,
                // });
                this.order.get().pipe(take(1)).subscribe(order => {
                  this.template.save(order).subscribe(() => {
                    setTimeout(() => {
                      // $(".loaderModal").modal("hide");
                    }, 1000);
                  });
                });
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
    });
  }


  onRemove(item_id: string) {

  }

}
