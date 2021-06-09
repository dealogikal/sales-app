import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { NewOrderService } from 'src/app/services/new-order.service';


@Component({
    selector: 'commodity-selector',
    templateUrl: './commodity-selector.component.html',
    styleUrls: ['./commodity-selector.component.scss']
})
export class CommoditySelectorComponent implements OnInit {


    formGroup: FormGroup;

    $selected!: Subscription;
    commodities$!: Observable<any>;
    filtered$!: Observable<any>;
    selected$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private config: ConfigService,
        private order: NewOrderService,
        private iziToast: NgxIzitoastService,

    ) {
        this.formGroup = this.formBuilder.group({
            filter: ['']
        });
    }

    ngOnInit() {

        this.order.get().pipe(take(1)).subscribe((order: any) => {
            this.selected$.next(order.commodity);
        });

        this.commodities$ = combineLatest(
            this.config.getCommodities(),
            this.selected$,
        ).pipe(
            map(([commodities, selected]) => {
                return commodities.map((c: any) => {
                    if (c.name == selected) {
                        // this.formBloc.minimumParticipants.next(c.minimumParticipants)
                    }
                    return {
                        name: c.name,
                        selected: c.name == selected
                    }
                })
            })
        );

        this.filtered$ = combineLatest(
            this.commodities$,
            this.formGroup.get('filter')!.valueChanges.pipe(startWith(''))
        ).pipe(
            map(([commodities, filter]) => {
                return commodities.filter((c: any) => c.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
            })
        );




    }

    ngOnDestroy() {
        if (this.$selected) {
            this.$selected.unsubscribe();
        }
    }

    onToggle(commodity: any) {
        const c = this.selected$.value == commodity.name ? undefined : commodity.name;
        this.selected$.next(c);
    }

    onDone() {
        combineLatest(
            this.order.get(),
            this.selected$
        ).pipe(take(1)).subscribe(([order, selected]) => {
            if (order.commodity == selected) {
                this.router.navigate(['../'], { relativeTo: this.route });
                return;
            }
            if (order.products.length) {
                this.iziToast.show({
                    title: 'Change Commodity',
                    message: `Are you sure you want to update, added products will be removed?`,
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
                                    this.order.set({ commodity: selected });
                                    this.order.set({ products: [] });
                                    this.router.navigate(['../'], { relativeTo: this.route });
                                }
                            }, toast, 'buttonName');
                        }, true],
                        ['<button>Cancel</button>', (instance: any, toast: any) => {
                            instance.hide({
                                transitionOut: 'fadeOutUp',
                            }, toast, 'buttonName');
                        }]
                    ],
                });
            } else {
                this.selected$.pipe(take(1)).subscribe(c => {
                    this.order.set({ commodity: c });
                });
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        });

    }








}