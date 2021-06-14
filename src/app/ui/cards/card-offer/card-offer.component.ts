import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { AccountType, COLOR, OfferStatus } from 'src/app/helpers/classes/classes';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'card-offer',
  templateUrl: './card-offer.component.html',
  styleUrls: ['./card-offer.component.scss']
})
export class CardOfferComponent implements OnInit {

  offer$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  selected$: BehaviorSubject<any> = new BehaviorSubject(false);

  date$!: Observable<any>;
  duration$!: Observable<any>;
  actions$!: Observable<any>;


  @Input()
  set data(value: any) {
    console.log('CardOfferComponent', value);
    this.offer$.next(value);
  }

  @Input() shippingMethod!: String;

  constructor(
    private user: UserService
  ) { }

  ngOnInit(): void {


    this.date$ = combineLatest(
      this.offer$,
      timer(0, 60000),
      (data: any) => data
    ).pipe(
      map((offer: any) => {
        return moment(offer.currentPrice.date).fromNow();
      })
    );

    this.duration$ = combineLatest(
      this.offer$,
      timer(0, 1000),
    ).pipe(
      filter(([offer, __]) => {
        return [OfferStatus.OPEN].indexOf(offer.status) !== -1;
      }),
      map(([offer, __]) => {
        // console.log("duration$", order);
        const due = moment(offer.currentPrice.expiration).format();
        // console.log('due', due);
        var ms = moment(due).diff(moment(new Date()));
        var d = moment.duration(ms);
        return {
          label: 'EXPIRES IN',
          value: [d.days(), d.hours(), d.minutes()],
          color: (() => {
            const date_expiry = moment(offer.currentPrice.expiration).format();
            const date_now = moment(new Date()).format();
            const time_remaining = moment.duration(moment(date_expiry).diff(date_now)).asHours();
            if (time_remaining < 8 && time_remaining > 5) return COLOR.AMBER;
            if (time_remaining < 5 && time_remaining > 2) return COLOR.ORANGE;
            if (time_remaining < 2) return COLOR.RED;
            return COLOR.BLUE;
          })()
        };
      })
    );

    this.actions$ = combineLatest(
      this.offer$,
      this.user.get().pipe(map(user => user.accountType)),
      this.selected$
    ).pipe(
      debounceTime(250),
      map(([offer, accountType, selected]) => {
        console.log('actions', offer, accountType, selected);
        if (
          accountType !== AccountType.SELLER &&
          offer.status == OfferStatus.OPEN &&
          !selected
        ) {
          return [
            {
              label: "SELECT THIS OFFER",
              icon: "check",
            },
          ];
        }
        if (
          accountType !== AccountType.SELLER &&
          offer.status == OfferStatus.OPEN &&
          selected
        ) {
          return [
            {
              label: "REMOVE IN CHECKOUT",
              icon: "x",
            },
          ];
        }
        return [];
      })
    );

  }



}
