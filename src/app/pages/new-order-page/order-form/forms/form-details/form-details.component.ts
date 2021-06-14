import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, delay, map, skipWhile, take, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { FormService } from 'src/app/services/form.service';
import { NewOrderService } from 'src/app/services/new-order.service';

@Component({
    selector: 'form-details',
    templateUrl: './form-details.component.html',
    styleUrls: ['./form-details.component.scss']
})
export class FormDetailsComponent implements OnInit {

    formGroup: FormGroup;

    $formInit!: Subscription;
    $update!: Subscription;

    initDone$: BehaviorSubject<any> =  new BehaviorSubject(false);
    hasSave$!: Observable<boolean>;


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
            notes: ['', Validators.required],
            attachments: this.formBuilder.array([])
        });
    }

    ngOnInit() {

        this.$formInit = this.formBloc.get().pipe(
            take(1),
            tap((form) => {
                // console.log('FormDetailsComponent $formInit 1', form);
                this.formGroup.patchValue({
                    notes: form.notes
                });
                form.attachments.forEach((attachment: any) => {
                    (<FormArray>this.formGroup.get('attachments')).push(new FormControl(attachment));
                });
            }),
        ).subscribe((form) => {
            // console.log('FormDetailsComponent $formInit 2', this.formGroup.value);
            this.initDone$.next(true);
        });

        this.$update = combineLatest(
            this.formGroup.valueChanges,
            this.initDone$.pipe(skipWhile(done => !done))
        ).subscribe(([form, done]) => {
            // console.log('update', form);
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
    }

    onSubmit() {
        if (!this.formGroup.valid) return;
        this.formBloc.set(this.formGroup.value);
        this.router.navigate(['../participants'], { relativeTo: this.route });
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

                                //     return;
                                // }

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