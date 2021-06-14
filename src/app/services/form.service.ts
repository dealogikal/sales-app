import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Product } from '../helpers/classes/classes';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  PRODUCT: string = 'dealo_product';
  $form!: Subscription;

  private form$: BehaviorSubject<Product> = new BehaviorSubject({
    product: '',
    type: '',
    qty: '',
    unit: '',
    shipping: {
      province: "",
      region: "",
      location: "",
      schedules: [],
    },
    notes: '',
    participants: [],
    attachments: [],
  } as Product);

  constructor() {
    this.retrieve();
    this.$form = this.form$.subscribe(form => this.save(form));
  }

  get(): Observable<any> {
    return this.form$.asObservable();
  }

  set(value: any) {
    const _value = Object.assign(this.form$.value, value);
    console.log('set', _value);
    this.form$.next(_value);
  }

  getValue(path: string) {
    return path.split('.').reduce((p: any, c: any) => {
      return p && p[c] || null;
    }, this.form$.value);
  }

  save(product: Product) {
    sessionStorage.setItem(this.PRODUCT, JSON.stringify(product));
  }

  retrieve() {
    this.form$.next(
      JSON.parse(sessionStorage.getItem(this.PRODUCT) as string) || {
        product: '',
        type: '',
        qty: '',
        unit: '',
        shipping: {
          province: '',
          region: '',
          location: '',
          schedules: [],
        },
        notes: '',
        participants: [],
        attachments: [],
      }
    );
  }

  clear() {
    this.form$.next({
      product: '',
      type: '',
      qty: '',
      unit: '',
      shipping: {
        province: '',
        region: '',
        location: '',
        schedules: [],
      },
      notes: '',
      participants: [],
      attachments: [],
    } as Product);
  }


  destroy() {

  }
}
