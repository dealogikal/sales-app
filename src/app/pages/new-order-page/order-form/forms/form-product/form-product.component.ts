import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, delay, map, skipWhile, take, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { FormService } from 'src/app/services/form.service';
import { NewOrderService } from 'src/app/services/new-order.service';

@Component({
    selector: 'form-product',
    templateUrl: './form-product.component.html',
    styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {

    formGroup: FormGroup;

    $type!: Subscription;
    $formInit!: Subscription;
    $update!: Subscription;

    config$!: Observable<any>;
    products$!: Observable<any>;
    types$!: Observable<any>;
    units$!: Observable<any>;
    hasSave$!: Observable<any>;

    enableSkip$!: Observable<any>

    initDone$: BehaviorSubject<any> = new BehaviorSubject(false);

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
            product: ['', Validators.required],
            type: ['', Validators.nullValidator],
            qty: ['', Validators.required],
            unit: ['', Validators.required],
        });

    }

    ngOnInit() {

        this.config$ = combineLatest(
            this.config.getCommodities(),
            this.order.get().pipe(skipWhile(order => !order.commodity)),
        ).pipe(
            map(([commodities, order]) => {
                return commodities.find((_commodity: any) => _commodity.name == order.commodity);
            })
        );

        this.enableSkip$ = combineLatest(
            this.order.get(),
            this.route.params
        ).pipe(map(([order, params]) => {
            return order.products.length && !params.item_id;
        }))

        this.products$ = this.config$.pipe(
            map((config) => {
                // console.log('products$', config);
                return config.products.map((product: any) => {
                    return product.name;
                })
            })
        );

        this.types$ = combineLatest(
            this.config$,
            this.formGroup.get('product')!.valueChanges
        ).pipe(
            map(([config, formProduct]) => {
                if (!formProduct) return [];
                const product = config.products.find((_product: any) => _product.name == formProduct);
                if (!product) return [];
                const types = product.type.map((type: any) => type.name);
                // console.log('types$', types);
                return types;
            }),
            tap(types => {
                this.formGroup.get('type')!.patchValue('');
                this.formGroup.get('unit')!.patchValue('');
                if (types.length) {
                    this.formGroup.get('type')!.setValidators([Validators.required]);
                } else {
                    this.formGroup.get('type')!.setValidators(null);
                }
            })
        );

        this.units$ = combineLatest(
            this.config$, this.types$,
            this.formGroup.get('product')!.valueChanges,
            this.formGroup.get('type')!.valueChanges
        ).pipe(
            map(([config, types, name, type]) => {
                const product = config.products.find((p: any) => p.name == name);

                if (!product) return [];
                if (types.length) {
                    if (!type) return [];
                    const _type = product.type.find((t: any) => t.name == type);
                    return _type.unit.map((u: any) => u.unit);
                }
                return product.unit.map((u: any) => u.unit);
            })
        );

        this.$formInit = combineLatest(
            this.formBloc.get(),
            this.config$
        ).pipe(
            take(1),
            delay(500),
            tap(([form, config]) => {
                this.formGroup.patchValue({
                    product: form.product,
                    qty: form.qty,
                });
            }),
            delay(500),
            tap(([form, config]) => {
                this.formGroup.patchValue({
                    type: form.type
                });
            }),
            delay(500),
            tap(([form, config]) => {
                this.formGroup.patchValue({
                    unit: form.unit
                });
            }),
        ).subscribe(([form, config]) => {
            // console.log('form product >>>', form);
            this.initDone$.next(true);
        });

        this.$update = combineLatest(this.formGroup.valueChanges, this.initDone$.pipe(skipWhile(done => !done))).subscribe(([form, done]) => {
            this.formBloc.set(this.formGroup.value);
        });

        this.hasSave$ = this.route.params.pipe(
            map((params) => {
                return !!params.item_id;
            })
        );

    }

    ngOnDestroy() {
        if (this.$type) {
            this.$type.unsubscribe();

        }
        if (this.$formInit) {
            this.$formInit.unsubscribe();

        }
    }

    onSubmit() {
        if (!this.formGroup.valid) return;
        this.router.navigate(['../shipping'], { relativeTo: this.route });
    }

    onClose() {
        var start_idx = this.router.url.indexOf('/form');
        var url = this.router.url.substring(0, start_idx);
        this.router.navigate([url]);
    }

    onSkipAndReuse() {
        this.order.get().pipe(
            map((order) => {
                const copy = order.products[0];
                return copy;
            })
        ).subscribe(copy => {
            const schedules = [
                {
                    id: (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase(),
                    date: copy.shipping.schedules[0].date,
                    time: copy.shipping.schedules[0].time,
                    qty: this.formBloc.getValue('qty'),
                    unit: this.formBloc.getValue('unit'),
                }
            ];
            const details = {
                shipping: {
                    region: copy.shipping.region,
                    province: copy.shipping.province,
                    location: copy.shipping.location,
                    schedules: schedules
                },
                notes: copy.notes,
                attachments: copy.attachments,

            };

            this.formBloc.set(details);
            this.router.navigate(['../participants'], { relativeTo: this.route });
        })
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

                                // if (order.isSameLocation) {

                                //     const products = JSON.parse(JSON.stringify(order.products));
                                //     products.forEach((product: any) => {
                                //         product.shipping.location = form.shipping.location;
                                //         product.shipping.region = form.shipping.region;
                                //         product.shipping.province = form.shipping.province;
                                //         product.shipping.schedules = form.shipping.schedules;
                                //         this.order.updateProduct(product);
                                //     });

                                // }

                                this.order.updateProduct(form);
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