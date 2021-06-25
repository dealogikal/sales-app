import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss']
})
export class CardTemplateComponent implements OnInit {

  data$: BehaviorSubject<any> = new BehaviorSubject({});
  date$!: Observable<any>;


  @Input()
  set data(value: any) {
    this.data$.next(value);
  }


  constructor(
  ) { }


  ngOnInit() {

    this.date$ = combineLatest(
      this.data$,
      timer(0, 60000),
      (data: any) => data
    ).pipe(
      map((template: any) => {
        return moment(template.lastUpdated).fromNow();
      })
    );

  }

}
