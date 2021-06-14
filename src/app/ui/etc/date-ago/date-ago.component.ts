import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { combineLatest, Observable, timer, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'date-ago',
  templateUrl: './date-ago.component.html',
  styleUrls: ['./date-ago.component.scss']
})
export class DateAgoComponent implements OnInit {

  date$: Observable<any> = new Observable();
  private data$: BehaviorSubject<any> = new BehaviorSubject('');
  private _date: any;

  @Input()
  set date(value: any) {
    console.log('dateAgo', value);
    this.data$.next(value);
    this._date = value;
  }

  constructor() {

  }

  ngOnInit() {
    this.date$ = combineLatest(
      this.data$,
      timer(0, 60000),
      (data: any) => data
    ).pipe(
      map((a: any) => {
        return moment(a).fromNow();
      })
    );
  }

}
