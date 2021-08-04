import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { delay, map, skipWhile, take, tap } from 'rxjs/operators';
import { OrderStatus, PaymentMethods } from 'src/app/helpers/classes/classes';
import { ConfigService } from 'src/app/services/config.service';
import { NewOrderService } from 'src/app/services/new-order.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { UserService } from 'src/app/services/user.service';

import * as moment from 'moment';
import { DateUtils } from 'src/app/helpers/pipes/pipe';
import { OrdersService } from 'src/app/services/orders.service';

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
    private new_order: NewOrderService,
    private order: OrdersService,
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

    this.order$ = this.new_order.get();

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
          if (!template) this.new_order.clear();
        }),
        skipWhile((template) => !template),
        take(1),
      ).subscribe(template => {
        console.log('template >>>', template);
        template.products = template.products.map((product: any) => {
          product.id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
          return product;
        });
        this.new_order.set(template);
      });

      if (this.$formInit) {
        this.$formInit.unsubscribe();
      }

      if (this.$form) {
        this.$form.unsubscribe();
      }

      this.$formInit = combineLatest(this.config$, this.new_order.get()).pipe(
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
        this.new_order.set(order);
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

    this.products$ = this.new_order.get().pipe(
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
    return this.new_order.filterPaymentMethod(paymentMethods, commodity)
  }

  onSubmit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    Object.keys(this.paymentGroup.controls).forEach((key) => {
      this.paymentGroup.controls[key].markAsDirty();
    });

    // this.form.updateValueAndValidity();
    if (!this.form.valid) {

      this.iziToast.show({
        title: 'Error',
        titleColor: '#933432',
        titleSize: '13',
        message: 'Incomplete details',
        messageColor: '#933432',
        messageSize: '13',
        position: 'bottomRight',
        backgroundColor: '#fddddd',
      });
      return;
    }

    if (this.form.valid) {
      combineLatest(
        this.new_order.get(),
        this.user$,
      ).pipe(take(1)).subscribe(([order, user]) => {
        // console.log('order >>>', order);
        const isInvalidDate = (() => {
          var today = moment(new Date());
          var date = moment(order.startDate + " " + order.startTime);
          var duration = moment.duration(date.diff(today));
          var minutes = duration.asMinutes();
          return minutes <= 15;
        })();

        const isShippingValid = (() => {
          return order.products.every((product: any) => {
            return product.shipping.schedules.every((schedule: any) => moment(`${schedule.date} ${schedule.time}`).isAfter(moment(new Date())));
          });
        })();


        const isShippingComplete = (() => {
          return order.products.every((product: any) => {
            return product.shipping.schedules.every((schedule: any) => {
              return schedule.date && schedule.time && schedule.qty && schedule.unit;
            });
          });
        })();

        if (!isShippingComplete) {
          this.iziToast.show({
            title: 'Error',
            titleColor: '#933432',
            titleSize: '13',
            message: 'Shipping Fields is incomplete',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        if (!isShippingValid) {

          this.iziToast.show({
            title: 'Error',
            titleColor: '#933432',
            titleSize: '13',
            message: 'Shipping Dates should be after the current date.',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        if (isInvalidDate) {
          this.iziToast.show({
            title: 'Error',
            titleColor: '#933432',
            titleSize: '13',
            message: 'Bid start time should not be less than 15 minutes from current time.',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        const orderDuration = order.duration;


        if (parseInt(orderDuration) < 1) {

          this.iziToast.show({
            title: 'Error',
            titleColor: '#933432',
            titleSize: '13',
            message: 'Duration should be at least 1 hour',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        const hasOrder = order.products.length;
        if (!hasOrder) {
          this.iziToast.show({
            title: 'Error',
            titleColor: '#933432',
            titleSize: '13',
            message: 'Minimum of 1 product is required.',
            messageColor: '#933432',
            messageSize: '13',
            position: 'bottomRight',
            backgroundColor: '#fddddd',
          });
          return;
        }

        this.iziToast.show({
          title: "Submit Request",
          message: "Are you sure you want to submit?",
          position: "center",
          closeOnEscape: false,
          close: false,
          overlay: true,
          timeout: 0,
          buttons: [
            [
              "<button>Confirm</button>",
              (instance: any, toast: any) => {
                instance.hide(
                  {
                    transitionOut: "fadeOutUp",
                    onClosing: (instance: any, toast: any, closedBy: any) => {
                      // $(".loaderModal").modal({
                      //   backdrop: "static",
                      //   keyboard: false,
                      // });

                      let result: any = {};

                      result.shipping = {
                        method: order.shippingMethod,
                        isSameLocation: order.isSameLocation
                      }

                      result.payment = {
                        method: order.payment.method,
                        option: order.payment.option,
                        channel: order.payment.channel,
                        days: order.payment.days
                      }

                      result.orders = {
                        commodity: order.commodity,
                        products: order.products.map((product: any) => {
                          product.qty = parseFloat(product.qty.replace(/\,/gi, ''));
                          product.status = OrderStatus.FOR_APPROVAL;
                          return product;
                        })
                      };

                      result.startDate = DateUtils.toUTC(new Date(order.startDate + ' ' + order.startTime));
                      result.duration = parseInt(order.duration);
                      result.dateCreated = DateUtils.toUTC(new Date());
                      result.dateApproved = null;

                      result.user = {
                        fullName: user.info.firstName + ' ' + user.info.lastName,
                        companyName: user.registration.businessProfile.companyName,
                        email: user.emails[0].address,
                        mobileNo: {
                          countryCode: user.info.mobileNo.countryCode,
                          number: user.info.mobileNo.number,
                        }
                      }

                      result.status = OrderStatus.FOR_APPROVAL;

                      result.transaction = {
                        currency: 'PHP',
                        isSpecialUser: false,
                        processingRate: user.processingRate,
                        taxType: user.registration.businessProfile.taxRate,
                        alias: 0,
                        batchId: 0,
                        user: {
                          fullName: user.info.firstName + ' ' + user.info.lastName,
                          companyName: user.registration.businessProfile.companyName,
                          email: user.emails[0].address,
                          mobileNo: {
                            countryCode: user.info.mobileNo.countryCode,
                            number: user.info.mobileNo.number,
                          },
                          cas: user.settings.cas
                        }

                      }

                      result.adminReview = {
                        userId: '',
                        date: new Date(),
                        notes: ''
                      };

                      result.warningNotif = {
                        hours_5: false,
                        hours_2: false,
                      }

                      result.comments = [];
                      result.changeLog = [];

                      // console.log('result >>>', result);

                      result.alias = 0;
                      result.batchId = 0;

                      this.order.save(result).subscribe(order => {
                        this.new_order.clear();
                        this.router.navigate(['/home/b/order', order._id]);
                      });
                    },
                  },
                  toast,
                  "buttonName"
                );
              },
              true,
            ], // true to focus
            [
              "<button>Cancel</button>",
              (instance: any, toast: any) => {
                instance.hide(
                  {
                    transitionOut: "fadeOutUp",
                  },
                  toast,
                  "buttonName"
                );
              },
            ],
          ],
        });



      });
    }
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
                this.new_order.get().pipe(take(1)).subscribe(order => {
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
    this.iziToast.show({
      title: 'Remove Product',
      message: `Are you sure you want to remove?`,
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
              this.new_order.removeProduct(item_id);
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
