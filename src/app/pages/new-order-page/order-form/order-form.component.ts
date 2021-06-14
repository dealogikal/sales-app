import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';
import { StepStatus } from 'src/app/helpers/classes/classes';
import { ConfigService } from 'src/app/services/config.service';
import { FormService } from 'src/app/services/form.service';
import { NewOrderService } from 'src/app/services/new-order.service';

@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  steps$!: Observable<any>;
  progress$!: Observable<any>;
  $progress!: Subscription;
  $routeParms!: Subscription;

  StepStatus: any = StepStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: FormService,
    private order: NewOrderService,
    private config: ConfigService,
    private iziToast: NgxIzitoastService,
  ) { }

  ngOnInit(): void {
    this.$routeParms = combineLatest(
      this.route.params,
      this.order.get()
    ).subscribe(([params, order]) => {
      // console.log('params', params);
      if (params.item_id) {
        const product = order.products.find((p: any) => p.id == params.item_id)
        this.form.set(product);
      }
    });

    this.steps$ = combineLatest(
      this.form.get(),
      this.order.get().pipe(skipWhile(order => !order.commodity)),
      this.config.getCommodities(),
    ).pipe(
      map(([form, order, commodities]) => {
        const _commodity = commodities.find((c: any) => c.name == order.commodity);

        const _product = form.product ? _commodity.products.find((p: any) => p.name == form.product) : undefined;
        const _hasType = _product ? _product.type.length : false;

        const steps = [];
        let step_index = 0;

        const product_requirements = _hasType ?
          [
            'product',
            'type',
            'qty',
            'unit'
          ] :
          [
            'product',
            'qty',
            'unit'
          ];

        const shipping_requirements = [
          'shipping.region',
          'shipping.province',
          'shipping.location',
        ];

        const details_requirements = [
          'notes'
        ];


        // console.log('product_requirements >>>', product_requirements);

        const product_incomplete = product_requirements.some(prop => {
          // console.log('product_incomplete', prop, this.form.getValue(prop));
          return !this.form.getValue(prop);
        });

        // console.log('product_incomplete >>>', product_incomplete);

        step_index = product_incomplete ? step_index : 1;

        const shipping_form_incomplete = shipping_requirements.some(prop => {
          return !this.form.getValue(prop);
        });

        const isMaxed = (() => {
          const total = this.form.getValue('shipping.schedules').reduce((total: any, sched: any) => {
            total += typeof sched.qty == 'string' ? parseInt(sched.qty.replaceAll(',', '')) : sched.qty;
            return total;
          }, 0);

          console.log('isMaxed', this.form.getValue('qty'), total);

          return total >= (typeof this.form.getValue('qty') == 'string' ? parseInt(this.form.getValue('qty').replaceAll(',', '')) : this.form.getValue('qty'));
        })();

        const schedules_incomplete = !this.form.getValue('shipping.schedules') || !this.form.getValue('shipping.schedules').length || !isMaxed;

        const shipping_incomplete = shipping_form_incomplete || schedules_incomplete;

        step_index = shipping_incomplete ? step_index : 2;

        const details_incomplete = details_requirements.some(prop => {
          return !this.form.getValue(prop);
        });

        step_index = details_incomplete ? step_index : 3;

        const parsedParticipants = form.participants.reduce((acc: any, curr: any) => {
          if (acc.findIndex((p: any) => p.label == curr.groupName) == -1) {
            acc.push({
              label: curr.groupName,
              selected: curr.selected
            });
          }
          return acc;
        }, []);

        const participants_incomplete = parsedParticipants ? parsedParticipants.length < 3 : true;

        step_index = participants_incomplete ? step_index : 4;

        steps.push({
          label: "Product",
          status:
            step_index == 0
              ? StepStatus.ONGOING
              : step_index < 0
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "product",
        });

        steps.push({
          label: "Shipping",
          status:
            step_index == 1
              ? StepStatus.ONGOING
              : step_index < 1
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "shipping",
        });

        steps.push({
          label: "Details",
          status:
            step_index == 2
              ? StepStatus.ONGOING
              : step_index < 2
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "details",
        });

        steps.push({
          label: "Participants",
          status:
            step_index == 3
              ? StepStatus.ONGOING
              : step_index < 3
                ? StepStatus.INCOMPLETE
                : StepStatus.COMPLETE,
          routerLink: "participants",
        });

        return steps;

      })
    );

    this.progress$ = this.steps$.pipe(
      map((steps) => {

        const completed = steps.reduce((acc: any, curr: any) => {
          curr.status == StepStatus.COMPLETE && acc++;

          acc = acc > steps.length - 1 ? steps.length - 1 : acc;

          return acc;
        }, 0);
        const res = {
          steps: steps,
          rate: (completed / (steps.length - 1)) * 100,
        };
        // console.log('progress', res);
        return res;
      })
    );

    this.$progress = combineLatest(
      this.route.params,
      this.progress$
    ).pipe(take(1)).subscribe(([params, progress]) => {
      const step = progress.steps.find(
        (step: any) => step.status == StepStatus.ONGOING
      )
        ? progress.steps.find(
          (step: any) => step.status == StepStatus.ONGOING
        ).label
        : 'participants';

      const steps = ['products', 'shipping', 'details', 'participants'];

      const segments = this.router.url.split('/');
      const url_step = segments[segments.length - 1];

      const isValid = steps.indexOf(url_step) <= steps.indexOf(step.toLowerCase());

      // console.log('isValid', isValid);

      let url = this.router.url.replace(url_step, step.toLowerCase());

      if (isValid) return;

      this.router.navigate([url]);
    });
  }

  ngOnDestroy() {

    this.form.clear();

    if (this.$progress) {
      this.$progress.unsubscribe();
    }

    if (this.$routeParms) {
      this.$routeParms.unsubscribe();
    }
  }

  onClose() {

    this.iziToast.show({
      title: 'Close',
      message: `Are you sure you want to close, changes will not be saved?`,
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
              var start_idx = this.router.url.indexOf('/form');
              var url = this.router.url.substring(0, start_idx);
              this.router.navigate([url]);
            }
          }, toast, 'buttonName');
        }, true],
        ['<button>Cancel</button>', (instance: any, toast: any) => {
          instance.hide({
            transitionOut: 'fadeOutUp'
          }, toast, 'buttonName');
        }]
      ],
    })
  }

}
