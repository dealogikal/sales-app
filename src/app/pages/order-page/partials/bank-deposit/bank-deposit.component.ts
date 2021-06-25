import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, debounceTime, take, filter, skipWhile, delay, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ConfigService } from '../../../../services/config.service';
import { PaymentService } from '../../../../services/payment.service';
import { UserService } from '../../../../services/user.service';
import { OrderStatus } from 'src/app/helpers/classes/classes';
import * as moment from 'moment';
import { NgxIzitoastService } from 'ngx-izitoast';
import { WorkflowService } from 'src/app/services/workflow.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'bank-deposit',
  templateUrl: './bank-deposit.component.html',
  styleUrls: ['./bank-deposit.component.scss']
})
export class BankDepositComponent implements OnInit {

  order$!: Observable<any>;
  banks$!: Observable<any>;
  options$!: Observable<any>;
  bank$!: Observable<any>;
  form!: FormGroup;

  $form!: Subscription;

  OrderStatus: any = OrderStatus;

  constructor(
    private order: OrderService,
    private orders: OrdersService,
    private config: ConfigService,
    private payment: PaymentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private user: UserService,
    private iziToast: NgxIzitoastService,
    private workflow: WorkflowService
  ) {
    this.form = this.formBuilder.group({
      bank: ['', Validators.required],
      file: ['', Validators.required]
    })
  }

  ngOnInit() {

    this.order$ = this.order.get();

    this.banks$ = this.config.getBanks();

    this.options$ = this.banks$.pipe(
      map(banks => {
        console.log('banks', banks);
        return banks.map((b: any) => b.bank);
      })
    );

    this.bank$ = combineLatest(
      this.form.get('bank')!.valueChanges,
      this.banks$,
    ).pipe(
      map(([bank, banks]) => banks.find((b: any) => b.bank == bank))
    );

    this.banks$.pipe(delay(100), take(1)).subscribe((banks => {
      console.log('tek1')
      this.form.get('bank')!.patchValue(banks[0].bank);
    }))

  }

  onProceed() {
    console.log('onProceed >>>');

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
              combineLatest(
                this.order.get(),
                this.payment.total(),
                this.banks$
              ).pipe(
                take(1),
                map(([order, total, banks]) => {
                  order.payment.bank = banks.find((b: any) => b.bank == this.form.get('bank')!.value);
                  order.payment.date = moment().format();
                  order.payment.document = this.form.get('file')!.value;
                  order.payment.amount = total;
                  console.log('order >>>', order);
                  return order;
                }),
                switchMap(order => {
                  return this.workflow.next(order, order.orders.products);
                }),
                switchMap(order => {
                  return this.orders.save(order);
                })
              ).subscribe(() => { })

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
