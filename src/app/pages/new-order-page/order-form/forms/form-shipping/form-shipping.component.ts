import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, delay, filter, map, skipWhile, startWith, take, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { NgxIzitoastService } from 'ngx-izitoast';
import { NewOrderService } from 'src/app/services/new-order.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'form-shipping',
    templateUrl: './form-shipping.component.html',
    styleUrls: ['./form-shipping.component.scss']
})
export class FormShippingComponent implements OnInit {

    formGroup: FormGroup;

    $provinces!: Subscription;
    $formInit!: Subscription;
    $update!: Subscription;

    $location!: Subscription;

    config$!: Observable<any>;
    regions$!: Observable<any>;
    provinces$!: Observable<any>;
    isMaxed$!: Observable<any>;

    remaining$!: Observable<any>;

    schedules$!: Observable<any>;

    schedules: FormArray;

    initDone$: BehaviorSubject<any> = new BehaviorSubject(false);
    hasSave$!: Observable<boolean>;
    $routeChange!: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private formBloc: FormService,
        private config: ConfigService,
        private order: NewOrderService,
        private iziToast: NgxIzitoastService,
    ) {

        this.formGroup = this.formBuilder.group({
            shipping: this.formBuilder.group({
                location: ["", Validators.required],
                region: ["", Validators.required],
                province: ["", Validators.required],
                schedules: this.formBuilder.array([])
            })
        });

        this.schedules = this.formGroup.get('shipping.schedules') as FormArray;

    }

    ngOnInit() {


        this.remaining$ = this.formBloc.get().pipe(
            map((product) => {

                const subtotal = product.shipping.schedules.reduce((acc: any, curr: any) => {
                    const curr_qty = typeof curr.qty == 'number' ? curr.qty : parseInt(curr.qty.replace(',', ''));

                    acc += curr_qty;
                    return acc;
                }, 0);

                const qty = typeof product.qty == 'number' ? product.qty : parseInt(product.qty.replace(',', ''));

                return {
                    qty: qty - subtotal,
                    unit: product.unit
                };
            })
        );

        this.schedules$ = this.formBloc.get().pipe(
            map(product => {
                const _product = JSON.parse(JSON.stringify(product));
                if (!_product.shipping.schedules) {
                    return [];
                }
                return _product.shipping.schedules.map((schedule: any) => {
                    schedule.date = moment(`${schedule.date} ${schedule.time}`).format("dddd, MMMM Do YYYY, h:mm a");
                    return schedule;
                })
            })
        );

        this.isMaxed$ = combineLatest(
            this.formBloc.get(),
            this.schedules$,
        ).pipe(
            map(([product, schedules]) => {
                const total = schedules.reduce((total: any, sched: any) => {
                    total += typeof sched.qty == 'string' ? parseInt(sched.qty.replaceAll(',', '')) : sched.qty;
                    return total;
                }, 0);

                console.log('isMaxed', product.qty, total);

                return total >= (typeof product.qty == 'string' ? parseInt(product.qty.replaceAll(',', '')) : product.qty);
            })
        );

        this.config$ = this.config.getCountries().pipe(
            map((countries) => {
                return countries.find((country: any) => country.name == 'Philippines');
            })
        );

        this.regions$ = this.config$.pipe(
            map((config) => {
                return config.states.map((region: any) => region.name);
            })
        );

        this.provinces$ = combineLatest(
            this.config$,
            this.formGroup.get('shipping.region')!.valueChanges,
        ).pipe(
            map(([config, region]) => {
                // console.log('provinces$', region);
                if (!region) return [];
                return config.states.find((_region: any) => _region.name == region).subdivision;
            })
        );

        this.$routeChange = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event) => {
            // console.log('route events shipping >>>');
            this.initDone$.next(false);
            this.$formInit = combineLatest(
                this.formBloc.get(),
                this.config$
            ).pipe(
                take(1),
                tap(([form]) => {
                    this.formGroup.get('shipping')!.patchValue({
                        location: form.shipping.location,
                    });

                    while ((<FormArray>this.schedules).length !== 0) {
                        (<FormArray>this.schedules).removeAt(0)
                    }
                    form.shipping.schedules.forEach((schedule: any) => {
                        this.schedules.push(new FormControl(schedule));
                    });
                    console.log('route change 0 >>>', this.formGroup.value);
                }),
                delay(500),
                tap(([form]) => {
                    this.formGroup.get('shipping')!.patchValue({
                        region: form.shipping.region,
                    });
                    console.log('route change 1 >>>', this.formGroup.value);
                }),
                delay(500),
                tap(([form]) => {
                    this.formGroup.get('shipping')!.patchValue({
                        province: form.shipping.province,
                    });
                    console.log('route change 2 >>>', this.formGroup.value);
                }),
                delay(500),
            ).subscribe(([form]) => {
                console.log('route change 3 >>>', this.formGroup.value);
                this.initDone$.next(true);
                // console.log('$routeChange', form);
            });
        });

        this.$formInit = combineLatest(
            this.formBloc.get().pipe(take(1)),
            this.config$
        ).pipe(
            take(1),
            tap(([form, config]) => {
                this.formGroup.get('shipping')!.patchValue({
                    location: form.shipping.location
                });
                while ((<FormArray>this.schedules).length !== 0) {
                    (<FormArray>this.schedules).removeAt(0)
                }
                form.shipping.schedules.forEach((schedule: any) => {
                    this.schedules.push(new FormControl(schedule));
                });
                console.log('init 0 >>>', this.formGroup.value);
            }),
            delay(500),
            tap(([form]) => {
                this.formGroup.get('shipping')!.patchValue({
                    region: form.shipping.region,
                });
                console.log('init 1 >>>', this.formGroup.value);
            }),
            delay(500),
            tap(([form, config]) => {
                this.formGroup.get('shipping')!.patchValue({
                    province: form.shipping.province,
                });
                console.log('init 2 >>>', this.formGroup.value);
            }),
        ).subscribe(([form, config]) => {
            console.log('int 3', form);
            this.initDone$.next(true);
        });

        this.$update = combineLatest(this.formGroup.valueChanges, this.initDone$).pipe(
            filter(([form, done]) => done)
        ).subscribe(([form, done]) => {
            this.formBloc.set(form);
        });

        this.hasSave$ = this.route.params.pipe(
            map((params) => {
                return !!params.item_id;
            })
        );


    }

    ngOnDestroy() {
        if (this.$formInit) {
            this.$formInit.unsubscribe();
        }

        if (this.$routeChange) {
            this.$routeChange.unsubscribe();
        }
    }



    removeSchedule(schedule: any) {
        this.formBloc.get().pipe(take(1)).subscribe(product => {
            const index = product.shipping.schedules.findIndex((a: any) => a.id == schedule.id);
            product.shipping.schedules.splice(index, 1);
            this.formBloc.set(product);
        });
    }

    onSubmit() {
        if (!this.formGroup.valid) return;
        this.formBloc.set(this.formGroup.value);
        this.router.navigate(['../details'], { relativeTo: this.route });
    }

    onRemove(e: any) {
        this.iziToast.show({
            title: 'Remove Shipping Schedule',
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

                            this.formBloc.get().pipe(take(1)).subscribe(product => {
                                const index = product.shipping.schedules.findIndex((sched: any) => sched.id == e.id);
                                product.shipping.schedules.splice(index, 1);
                                this.formBloc.set(product);
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
    }

    onSave() {
        this.iziToast.show({
            title: 'Update Product',
            message: `Are you sure you want to update?`,
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
                                this.formBloc.get(),
                                this.order.get()
                            ).pipe(
                                take(1)
                            ).subscribe(([form, order]) => {

                                if (order.isSameLocation) {

                                    const products = JSON.parse(JSON.stringify(order.products));
                                    products.forEach((product: any) => {
                                        product.shipping.location = form.shipping.location;
                                        product.shipping.region = form.shipping.region;
                                        product.shipping.province = form.shipping.province;
                                        // product.shipping.schedules = form.shipping.schedules;
                                        this.order.updateProduct(product);
                                    });

                                    // return;
                                }

                                this.order.updateProduct(form)
                                var start_idx = this.router.url.indexOf('/form');
                                var url = this.router.url.substring(0, start_idx);
                                this.router.navigate([url]);
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
    }


}