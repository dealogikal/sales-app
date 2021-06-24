import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, debounceTime, take, filter, skipWhile, delay } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ConfigService } from '../../../../services/config.service';
import { PaymentService } from '../../../../services/payment.service';
import { UserService } from '../../../../services/user.service';
import { OrderStatus } from 'src/app/helpers/classes/classes';

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
    private config: ConfigService,
    private payment: PaymentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private user: UserService,
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

    this.banks$.pipe(delay(100),take(1)).subscribe((banks => {
      console.log('tek1')
      this.form.get('bank')!.patchValue(banks[0].bank);
    }))

  }

  onProceed() {
    
  }






}
