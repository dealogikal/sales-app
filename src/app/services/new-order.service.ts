import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Order, Product, PaymentMethod, PaymentMethods } from '../helpers/classes/classes';

@Injectable({
  providedIn: 'root'
})
export class NewOrderService {
  NEW_ORDER_STORAGE = 'demo_new_order';
  $order: Subscription;
  order$: BehaviorSubject<Order> = new BehaviorSubject({
      startDate: '',
      startTime: '',
      duration: '0',
      commodity: '',
      shippingMethod: '',
      payment: {
          method: '',
          option: '',
          channel: '',
      },
      products: []
  } as Order);

  get(): Observable<any> {
      return this.order$.asObservable();
  }

  set(order: any) {
      const _order = Object.assign(this.order$.value, order);
      console.log('set', _order);
      this.order$.next(_order);
  }

  addProduct(product: Product) {
      const order = this.order$.value;
      product.id = (Date.now().toString(36) + Math.floor(1000 + Math.random() * 9000) + Math.random().toString(36).substr(2, 3)).toUpperCase();
      order.products.push(product);
      // console.log('order', order);
      this.order$.next(order);
  }

  removeProduct(item_id: string) {
      const order = JSON.parse(JSON.stringify(this.order$.value));
      const products = order.products.filter((p: Product) => p.id !== item_id);
      order.products = products;
      this.order$.next(order);
  }

  updateProduct(product: Product) {
      console.log('updateProduct', product);
      const order = JSON.parse(JSON.stringify(this.order$.value));
      const productIndex = order.products.findIndex((p: Product) => p.id == product.id);
      // console.log('productIndex', productIndex);
      order.products[productIndex] = product;
      // console.log('order.products', order.products);
      this.order$.next(order);
  }

  save(order: Order) {
      sessionStorage.setItem(this.NEW_ORDER_STORAGE, JSON.stringify(order));
  }

  filterPaymentMethod(paymentMethods: string[], commodity:string){
      if (!paymentMethods || !commodity) return;

      if (['Medical Supplies'].indexOf(commodity) == -1) {
          return paymentMethods.filter((p) => { return p != PaymentMethods.TERMS });            
      } else {
          // return paymentMethods;
          return paymentMethods.filter((p) => { return p != PaymentMethods.TERMS });
      }

  }

  retrieve() {
      this.order$.next(JSON.parse(sessionStorage.getItem(this.NEW_ORDER_STORAGE) as string) || {
          startDate: '',
          startTime: '',
          duration: '0',
          commodity: '',
          shippingMethod: '',
          isSameLocation: false,
          payment: {
              method: '',
              option: '',
              channel: '',
          },
          products: []
      });
  }

  getValue(path: string) {
      return path.split('.').reduce((p: any, c: any) => {
          return p && p[c] || null;
      }, this.order$.value);
  }

  clear() {
      this.order$.next({
          startDate: '',
          startTime: '',
          duration: '0',
          commodity: '',
          shippingMethod: '',
          isSameLocation: false,
          payment: {
              method: '',
              option: '',
              channel: '',
          },
          products: []
      });
  }

  constructor() {
      this.retrieve();
      this.$order = this.order$.subscribe(order => this.save(order));
  }

  destroy() {

  }
}
