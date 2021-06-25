import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from './order.service';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  private result$!: Observable<any>;
  private currentId$: BehaviorSubject<any> = new BehaviorSubject('');

  private settings: any;

  private open: BehaviorSubject<any> = new BehaviorSubject(true);

  constructor(
    private orders: OrdersService
  ) {
    this.result$ = combineLatest(
      this.orders.get(),
      this.currentId$
    ).pipe(
      map(([collection, currentId]) => {
        var currIndex = collection.findIndex((item: any) => {
          const id = item.bidId ? item.bidId : item._id;
          return id == currentId
        });

        var prevId = !collection[currIndex - 1] ? '' : collection[currIndex - 1].bidId ? collection[currIndex - 1].bidId : collection[currIndex - 1]._id;
        var nextId = !collection[currIndex + 1] ? '' : collection[currIndex + 1].bidId ? collection[currIndex + 1].bidId : collection[currIndex + 1]._id;

        return {
          home: this.settings.homeLink,
          params: this.settings.queryParams,
          prev: prevId ? this.settings.routerLink.replace('$id', prevId) : '',
          next: nextId ? this.settings.routerLink.replace('$id', nextId) : '',
        };
      })
    )
  }

  toggleMenu() {
    this.open.next(!this.open.value);
  }

  getToggle(): Observable<any> {
    return this.open.asObservable();
  }

  get(): Observable<any> {
    return this.result$;
  }

  set(settings: any) {
    this.settings = settings;
    this.save(settings);
  }

  setCurrentId(id: string) {
    // console.log('setCurrentId >>>', id);
    this.currentId$.next(id);
  }

  save(settings: any) {
    sessionStorage.setItem('navigator', JSON.stringify(settings));
  }

  retrieve() {
    this.settings = JSON.parse(sessionStorage.getItem("navigator") as string);
  }
}
