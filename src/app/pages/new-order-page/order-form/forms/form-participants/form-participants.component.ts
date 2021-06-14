import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { FormService } from 'src/app/services/form.service';
import { NewOrderService } from 'src/app/services/new-order.service';



@Component({
    selector: 'form-participants',
    templateUrl: './form-participants.component.html',
    styleUrls: ['./form-participants.component.scss']
})
export class FormParticipantsComponent implements OnInit {

    participants$!: Observable<any>;
    parsedParticipants$!: Observable<any>;
    $update!: Subscription;
    hasSave$!: Observable<boolean>;
    minParticipants$!: Observable<any>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private formBloc: FormService,
        private order: NewOrderService,
        private config: ConfigService,
        private iziToast: NgxIzitoastService,
    ) {

    }

    ngOnInit() {

        // this.formBloc.minimumParticipants.subscribe((val)=> {
        //     console.log('minimumParticipants', val)
        //     this.minimumParticipants = val;
        // })

        this.participants$ = this.formBloc.get().pipe(
            map((form) => {
                // console.log('FormParticipantsComponent >>>', form);
                return form.participants || [];
            })
        );

        this.parsedParticipants$ = this.participants$.pipe(
            map(participants => {
                return participants.reduce((acc: any, curr: any) => {
                    if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
                        acc.push({
                            label: curr.groupName,
                            selected: curr.selected
                        });
                    }
                    return acc;
                }, [])
            })
        );


        this.minParticipants$ = combineLatest(
            this.order.get(),
            this.formBloc.get().pipe(take(1)),
            this.config.getCommodities()
        ).pipe(
            map(([order, form, commodities]) => {
                console.log('minParticipants >>>', order, form, commodities);
                const commodity = commodities.find((commodity: any) => commodity.name == order.commodity);
                const product = commodity.products.find((product: any) => product.name == form.product);
                return product.minParticipants;
            })
        );

        this.hasSave$ = this.route.params.pipe(
            map((params) => {
                return !!params.item_id;
            })
        );

    }

    ngOnDestroy() {

    }

    onDone() {
        this.route.params.pipe(take(1)).subscribe(params => {
            if (params.item_id) {
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
                                    this.formBloc.get().pipe(take(1)).subscribe(product => {
                                        this.order.updateProduct(product)
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
                return;
            }
            this.iziToast.show({
                title: 'Add Product',
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
                                            this.order.updateProduct(product);
                                        });
                                    }

                                    this.order.addProduct(form);
                                    this.formBloc.clear();
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