import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { COLOR, OrderStatus } from 'src/app/helpers/classes/classes';

@Component({
  selector: 'status-tag',
  templateUrl: './status-tag.component.html',
  styleUrls: ['./status-tag.component.scss']
})
export class StatusTagComponent implements OnInit {
  @HostBinding('class') class = '';

  data$: BehaviorSubject<any> = new BehaviorSubject({});
  status$: Observable<any> = new Observable();

  @Input()
  set data(value: any) {
    this.data$.next(value);
  }

  constructor() {

    this.status$ = combineLatest(
      this.data$
    ).pipe(
      map(([data]) => {
        let res = {
          value: data,
          color: (() => {
            if ([
              OrderStatus.EXPIRED,
              OrderStatus.CANCELLED,
              OrderStatus.DENIED,
              OrderStatus.OVERDUE
            ].indexOf(data) !== -1) {
              return COLOR.RED;
            };
            return COLOR.BLUE;
          })()
        };
        // console.log('res stat', res)
        return res;
      })
    );
  }

  ngOnInit() {

  }

}
