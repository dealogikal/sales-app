import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, delay, map, skipWhile, startWith, take, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { FormService } from 'src/app/services/form.service';
import { NgxIzitoastService } from 'ngx-izitoast';

@Component({
    selector: 'schedule-select',
    templateUrl: './schedule-select.component.html',
    styleUrls: ['./schedule-select.component.scss']
})
export class ScheduleSelectComponent implements OnInit {

    formGroup: FormGroup;

    remaining$!: Observable<any>;
    max$!: Observable<any>;

    isExist$!: Observable<any>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private formBloc: FormService,
        private iziToast: NgxIzitoastService,
    ) {
        this.formGroup = this.formBuilder.group({
            date: ['', Validators.required],
            time: ['', Validators.required],
            qty: ['', Validators.required],
        });
    }

    ngOnInit() {
        combineLatest(
            this.route.params,
            this.formBloc.get(),
        ).pipe(take(1)).subscribe(([params, product]) => {
            if (params.schedule_id) {
                const schedule = product.shipping.schedules.find((sched: any) => sched.id == params.schedule_id)

                this.formGroup.patchValue({
                    date: schedule.date,
                    time: schedule.time,
                    qty: schedule.qty,
                });

            }
        });

        this.formGroup.get('qty')!.valueChanges.subscribe((e) => console.log('wewew', e));

        this.isExist$ = this.route.params.pipe(map(params => !!params.schedule_id));

        this.remaining$ = combineLatest(
            this.route.params,
            this.formBloc.get(),
            this.formGroup.get('qty')!.valueChanges.pipe(startWith(0), map(form_qty => typeof form_qty == 'number' ? form_qty : parseInt(form_qty.replace(',', ''))))
        ).pipe(
            map(([params, product, form_qty]) => {

                const subtotal = product.shipping.schedules.reduce((acc: any, curr: any) => {
                    const curr_qty = typeof curr.qty == 'number' ? curr.qty : parseInt(curr.qty.replace(',', ''));

                    acc += params.schedule_id == curr.id ? form_qty : curr_qty;
                    return acc;
                }, 0);

                const qty = typeof product.qty == 'number' ? product.qty : parseInt(product.qty.replace(',', ''));

                return {
                    qty: params.schedule_id ? qty - subtotal : qty - (subtotal + (form_qty || 0)),
                    unit: product.unit
                };
            })
        );

        this.max$ = combineLatest(
            this.route.params,
            this.formBloc.get(),
        ).pipe(
            map(([params, product]) => {

                const subtotal = product.shipping.schedules.reduce((acc: any, curr: any) => {
                    const curr_qty = typeof curr.qty == 'number' ? curr.qty : parseInt(curr.qty.replace(',', ''));

                    acc += params.schedule_id == curr.id ? 0 : curr_qty;
                    return acc;
                }, 0);


                const qty = typeof product.qty == 'number' ? product.qty : parseInt(product.qty.replace(',', ''));


                return qty - subtotal;
            })
        );
    }

    ngOnDestroy() {

    }

    onSubmit() {
        this.route.params.pipe(take(1), map(params => !!params.schedule_id)).subscribe(e => {
            if (e) this.onUpdate();
            else this.onAdd();
        })
    }

    onAdd() {

        this.iziToast.show({
            title: 'Add Shipping Schedule',
            message: `Are you sure you want to add?`,
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

                            const id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
                            console.log('on add', this.formGroup.value);

                            this.formBloc.get().pipe(take(1)).subscribe((product) => {
                                console.log('product', product);
                                const schedule = Object.assign(this.formGroup.value, { id: id, unit: product.unit });
                                if (!product.shipping.schedules) product.shipping.schedules = [];
                                product.shipping.schedules.push(schedule);

                                product.shipping.schedules = product.shipping.schedules.sort((a: any, b: any) => {
                                    return moment(`${a.date} ${a.time}`).unix() - moment(`${b.date} ${b.time}`).unix()
                                });
                                this.formBloc.set(product);
                                this.router.navigate(['../'], { relativeTo: this.route });
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

    onUpdate() {

        this.iziToast.show({
            title: 'Update Shipping Schedule',
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
                                this.route.params,
                            ).pipe(take(1)).subscribe(([product, params]) => {
                                const schedule = product.shipping.schedules.find((schedule: any) => schedule.id == params.schedule_id);
                                const index = product.shipping.schedules.findIndex((schedule: any) => schedule.id == params.schedule_id);
                                const update = Object.assign(schedule, this.formGroup.value);
                                product.shipping.schedules[index] = update;

                                product.shipping.schedules = product.shipping.schedules.sort((a: any, b: any) => {
                                    return moment(`${a.date} ${a.time}`).unix() - moment(`${b.date} ${b.time}`).unix()
                                });

                                this.formBloc.set(product);
                                this.router.navigate(['../../'], { relativeTo: this.route });
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

    onClose() {
        this.route.params.pipe(take(1)).subscribe(params => {
            this.router.navigate([params.schedule_id ? '../../' : '../'], { relativeTo: this.route });
        })
    }






}